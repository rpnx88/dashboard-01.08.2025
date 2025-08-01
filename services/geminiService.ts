
import { GoogleGenAI, Type } from '@google/genai';
import { Proposal } from '../types';

const CATEGORIES = [
  'Iluminação Pública',
  'Sinalização e Trânsito',
  'Pavimentação e Vias',
  'Manutenção e Limpeza Urbana',
  'Gestão de Resíduos',
  'Planejamento Urbano e Programas',
  'Espaços Públicos e Infraestrutura',
  'Prédios Públicos',
  'Outros',
];

const BASE_URL = 'https://sapl.camarabento.rs.gov.br';
const URL_PAGE_1 = `https://sapl.camarabento.rs.gov.br/materia/pesquisar-materia?tipo=8&ementa=&numero=&numeracao__numero_materia=&numero_protocolo=&ano=2024&autoria__autor=400&autoria__primeiro_autor=unknown&autoria__autor__tipo=&autoria__autor__parlamentar_set__filiacao__partido=&o=&tipo_listagem=1&tipo_origem_externa=&numero_origem_externa=&ano_origem_externa=&data_origem_externa_0=&data_origem_externa_1=&local_origem_externa=&data_apresentacao_0=&data_apresentacao_1=&data_publicacao_0=&data_publicacao_1=&relatoria__parlamentar_id=&em_tramitacao=&tramitacao__unidade_tramitacao_destino=&tramitacao__status=&materiaassunto__assunto=&indexacao=&regime_tramitacao=`;
const URL_PAGE_2 = `https://sapl.camarabento.rs.gov.br/materia/pesquisar-materia?page=2&tipo=8&ementa=&numero=&numeracao__numero_materia=&numero_protocolo=&ano=2024&autoria__autor=400&autoria__primeiro_autor=unknown&autoria__autor__tipo=&autoria__autor__parlamentar_set__filiacao__partido=&o=&tipo_listagem=1&tipo_origem_externa=&numero_origem_externa=&ano_origem_externa=&data_origem_externa_0=&data_origem_externa_1=&local_origem_externa=&data_apresentacao_0=&data_apresentacao_1=&data_publicacao_0=&data_publicacao_1=&relatoria__parlamentar_id=&em_tramitacao=&tramitacao__unidade_tramitacao_destino=&tramitacao__status=&materiaassunto__assunto=&indexacao=&regime_tramitacao=`;

type RawProposal = Omit<Proposal, 'category' | 'status' | 'locations'>;

// Helper to fetch content via our own serverless proxy.
const fetchViaProxy = async (url: string): Promise<string> => {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request via own proxy failed for ${url}. Status: ${response.status}. Body: ${errorText}`);
        }
        const html = await response.text();
        if (!html) {
             throw new Error(`Proxy returned empty content for ${url}`);
        }
        return html;
    } catch (error) {
        console.error(`Failed to fetch ${url} via own proxy:`, error);
        throw error;
    }
};


function parseHtmlForProposals(html: string, baseUrl: string): RawProposal[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const rows = doc.querySelectorAll('table.table-striped tbody tr');

  const proposals = Array.from(rows).map((row): RawProposal | null => {
    try {
      const idElement = row.querySelector('td:nth-child(1) > b > a');
      const protocolElement = row.querySelector('td:nth-child(1) > div');
      
      const pElement = row.querySelector('td:nth-child(2) > p.mb-0');
      if (!pElement) return null;

      const ementaNode = Array.from(pElement.childNodes).find(node => 
        node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'B' && node.textContent?.trim() === 'Ementa:'
      );
      const description = ementaNode ? (ementaNode.nextSibling as Text)?.nodeValue?.trim() || '' : '';

      const pdfLinkElement = pElement.querySelector<HTMLAnchorElement>('.texto-original a');

      if (idElement && protocolElement && description && pdfLinkElement) {
        const idText = (idElement.textContent || '').trim();
        const protocolText = (protocolElement.textContent || '').replace('Protocolo:', '').trim();
        
        const relativePdfUrl = pdfLinkElement.getAttribute('href');
        if (!relativePdfUrl) {
             console.warn('Skipping row due to missing PDF link:', row);
             return null;
        }
        const pdfUrl = new URL(relativePdfUrl, baseUrl).href;

        const idMatch = idText.match(/IND\s(\d+\/\d+)/);
        const id = idMatch ? `IND ${idMatch[1]}` : idText;

        const dateMatch = protocolText.match(/de\s(\d{2}\/\d{2}\/\d{4})/);
        const protocolDate = dateMatch ? dateMatch[1] : 'N/A';
        const year = protocolDate !== 'N/A' ? parseInt(protocolDate.split('/')[2], 10) : new Date().getFullYear();

        if (!id || !description || protocolDate === 'N/A') {
          console.warn('Skipping row due to missing data:', row);
          return null;
        }
        
        return { id, title: idText, description, protocolDate, year, pdfUrl };
      }
      return null;
    } catch (error) {
      console.error('Error parsing proposal row:', error);
      return null;
    }
  });

  return proposals.filter((p): p is RawProposal => p !== null);
}

// In-memory cache for API responses to avoid re-processing the same description
const apiCache = new Map<string, { category: string; locations: string[] }>();

async function analyzeProposalDescription(description: string): Promise<{ category: string; locations: string[] }> {
    if (apiCache.has(description)) {
        return apiCache.get(description)!;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

        const schema = {
            type: Type.OBJECT,
            properties: {
                category: {
                    type: Type.STRING,
                    enum: CATEGORIES,
                    description: 'A categoria da proposta.'
                },
                locations: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                        description: 'Um nome de rua, bairro, praça ou local específico.'
                    },
                    description: 'Uma lista de locais geográficos (ruas, bairros, etc.) mencionados na ementa. Se nenhum local for mencionado, retorne um array vazio.'
                }
            },
            required: ['category', 'locations']
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analise a seguinte ementa de indicação legislativa. Extraia os principais locais mencionados (como nomes de ruas, bairros ou praças) e classifique a ementa em uma das categorias fornecidas no schema. Ementa: "${description}"`,
            config: {
                temperature: 0,
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && result.category && Array.isArray(result.locations)) {
             // Ensure category is valid, falling back to "Outros" if not.
            const finalCategory = CATEGORIES.includes(result.category) ? result.category : 'Outros';
            const finalResult = { category: finalCategory, locations: result.locations };
            apiCache.set(description, finalResult);
            return finalResult;
        } else {
             throw new Error("Invalid JSON structure in Gemini response.");
        }
    } catch (error) {
        console.error("Error calling Gemini API or parsing response:", error);
        // Fallback on error
        const fallback = { category: 'Outros', locations: [] };
        apiCache.set(description, fallback); // Cache fallback to prevent retries
        return fallback;
    }
}


export async function processLegislativeText(): Promise<Proposal[]> {
  let htmlPage1: string;
  let htmlPage2 = ''; // Initialize as empty string

  try {
    // Fetch the first page, which is mandatory.
    htmlPage1 = await fetchViaProxy(URL_PAGE_1);
  } catch (error) {
    console.error("Error fetching the primary legislative page:", error);
    // If the first page fails, we cannot proceed.
    throw new Error(`Falha ao carregar dados principais do portal da câmara. O serviço pode estar indisponível. Detalhes: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }

  try {
    // Attempt to fetch the second page. If it fails, we'll continue with just the first page.
    htmlPage2 = await fetchViaProxy(URL_PAGE_2);
  } catch (error: any) {
    // A 404 error on the second page is expected if there are not enough results.
    // We log a warning and continue without it. For other errors, we also warn but don't halt execution.
    if (error.message && error.message.includes('404 Not Found')) {
      console.warn("Segunda página de resultados não encontrada (404). Isso é esperado se houver poucos resultados. Continuando com a primeira página.");
    } else {
      console.warn(`Não foi possível carregar a segunda página de resultados. Continuando apenas com a primeira. Erro: ${error.message}`);
    }
    // htmlPage2 remains an empty string, which is handled by the parser.
  }

  const rawProposalsPage1 = parseHtmlForProposals(htmlPage1, BASE_URL);
  const rawProposalsPage2 = parseHtmlForProposals(htmlPage2, BASE_URL);

  const allRawProposals = [...rawProposalsPage1, ...rawProposalsPage2];

  if (allRawProposals.length === 0) {
      throw new Error("Nenhuma indicação foi encontrada para processar. O site de origem pode ter mudado sua estrutura ou está temporariamente bloqueando o acesso automatizado.");
  }
  
  const uniqueProposalsMap = new Map<string, RawProposal>();
  allRawProposals.forEach(p => uniqueProposalsMap.set(p.id, p));
  const uniqueRawProposals = Array.from(uniqueProposalsMap.values());

  const categorizedProposalsPromises = uniqueRawProposals.map(async (p) => {
    const { category, locations } = await analyzeProposalDescription(p.description);
    return {
      ...p,
      category,
      locations,
      status: 'Ativo' as const,
    };
  });

  const proposals = await Promise.all(categorizedProposalsPromises);
  
  proposals.sort((a, b) => {
    const dateA = a.protocolDate.split('/').reverse().join('-');
    const dateB = b.protocolDate.split('/').reverse().join('-');
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return proposals;
}
