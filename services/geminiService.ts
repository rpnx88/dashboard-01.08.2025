
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

// Dados estáticos pré-analisados para substituir as chamadas de API
const preCategorizedData: Record<string, { category: string; locations: string[], pdfUrl: string }> = {
    'IND 194/2025': { category: 'Sinalização e Trânsito', locations: ['rua Antônio Martineli, 571', 'Empresa FVA'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31854/cmbgind202500194a.pdf' },
    'IND 185/2025': { category: 'Sinalização e Trânsito', locations: ['rua Domênico Zanetti', 'Lot. Zanetti'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31845/cmbgind202500185a.pdf' },
    'IND 184/2025': { category: 'Prédios Públicos', locations: ['Escola EMEF Professor Agostino Brun', 'bairro Imigrante'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31844/cmbgind202500184a.pdf' },
    'IND 164/2025': { category: 'Sinalização e Trânsito', locations: ['rua Júlio Lorenzoni', 'rua Cavalheiro José Farina', 'bairro Licorsul'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31811/cmbgind202500164a.pdf' },
    'IND 150/2025': { category: 'Espaços Públicos e Infraestrutura', locations: ['Praça Pública Piazza Arrivare', 'Rua Ângelo Luchese', 'bairro Barracão'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31792/cmbgind202500150a.pdf' },
    'IND 146/2025': { category: 'Sinalização e Trânsito', locations: ['rua Eugênio Valduga', 'bairro São Francisco'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31786/cmbgind202500146a.pdf' },
    'IND 130/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['rua Visconde de São Gabriel'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31762/cmbgind202500130a.pdf' },
    'IND 122/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['Rua Xingú, 559', 'bairro São Bento', 'escritório Martini Advogados'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31753/cmbgind202500122a.pdf' },
    'IND 105/2025': { category: 'Sinalização e Trânsito', locations: ['rua Assis Brasil', 'bairro Centro'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31732/cmbgind202500105a.pdf' },
    'IND 104/2025': { category: 'Pavimentação e Vias', locations: ['rua João Domingos Polli', 'bairro Zatt'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31731/cmbgind202500104a.pdf' },
    'IND 99/2025': { category: 'Pavimentação e Vias', locations: ['Rua Cavalheiro José Farina, n.º 934', 'LS Bolsas'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31720/cmbgind202500099a.pdf' },
    'IND 98/2025': { category: 'Iluminação Pública', locations: ['esquina Joaquim Manfredini com a Cavalheiro José Farina', 'bairro São Francisco'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31717/cmbgind202500098a.pdf' },
    'IND 91/2025': { category: 'Pavimentação e Vias', locations: ['Rua Batista Dosso', 'bairro Santa Marta'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31705/cmbgind202500091a.pdf' },
    'IND 90/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['RS-444', 'trevo de acesso ao Barracão'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31704/cmbgind202500090a.pdf' },
    'IND 89/2025': { category: 'Pavimentação e Vias', locations: ['Rua Batista Dosso', 'bairro Santa Marta'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31703/cmbgind202500089a.pdf' },
    'IND 64/2025': { category: 'Planejamento Urbano e Programas', locations: [], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31675/cmbgind202500064a.pdf' },
    'IND 55/2025': { category: 'Pavimentação e Vias', locations: ['Rua Fortunato João Rizzardo', 'bairro Borgo'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31662/cmbgind202500055a.pdf' },
    'IND 52/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['rua Xingú', 'av. Planalto', 'bairro São Bento'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31659/cmbgind202500052a.pdf' },
    'IND 51/2025': { category: 'Gestão de Resíduos', locations: ['Rua Herny Hugo Dreher', 'bairro Planalto'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31658/cmbgind202500051a.pdf' },
    'IND 47/2025': { category: 'Planejamento Urbano e Programas', locations: ['Rua Xingú'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31654/cmbgind202500047a.pdf' },
    'IND 34/2025': { category: 'Espaços Públicos e Infraestrutura', locations: ['rua Marques de Souza, nº 773', 'bairro São Francisco', 'cemitério público municipal'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31637/cmbgind202500034a.pdf' },
    'IND 21/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['Rua Mário Italvino Poleto', 'bairro Fenavinho'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31620/cmbgind202500021a.pdf' },
    'IND 18/2025': { category: 'Sinalização e Trânsito', locations: ['Rua Assis Brasil', 'bairro São Francisco'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31617/cmbgind202500018a.pdf' },
    'IND 16/2025': { category: 'Iluminação Pública', locations: ['Rua 13 de maio', 'rua Xingú', 'bairro São Bento'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31613/cmbgind202500016a.pdf' },
    'IND 15/2025': { category: 'Iluminação Pública', locations: ['travessa Juarez Postal', 'bairro Borgo'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31612/cmbgind202500015a.pdf' },
    'IND 14/2025': { category: 'Iluminação Pública', locations: ['travessa Juarez Postal', 'rua Marcos Pedro Flaiban'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31611/cmbgind202500014a.pdf' },
    'IND 13/2025': { category: 'Iluminação Pública', locations: ['rua Garibaldi, 559', 'SUSFA'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31610/cmbgind202500013a.pdf' },
    'IND 6/2025': { category: 'Gestão de Resíduos', locations: ['Rua Assis Brasil, n° 115', 'bairro Centro'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31596/cmbgind202500006a.pdf' },
    'IND 5/2025': { category: 'Gestão de Resíduos', locations: ['Av. Dr. Casagrande', 'Rua Olavo Bilac', 'bairro Centro'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31595/cmbgind202500005a.pdf' },
    'IND 4/2025': { category: 'Iluminação Pública', locations: ['Rua Luís Neves', 'bairro Borgo'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31594/cmbgind202500004a.pdf' },
    'IND 3/2025': { category: 'Iluminação Pública', locations: ['Rua Ângela Tecchio', 'bairro Borgo'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31593/cmbgind202500003a.pdf' },
    'IND 964/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['Rua João Casagrande, nº 495', 'Bairro Imigrante'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33908/cmbgind202500964a.pdf' },
    'IND 924/2025': { category: 'Pavimentação e Vias', locations: ['cruzamento das ruas Ângelo Marcon com Avelino Menegotto'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33555/cmbgind202500924a.pdf' },
    'IND 915/2025': { category: 'Gestão de Resíduos', locations: ['Rua Pedro Rosa'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33541/cmbgind202500915a.pdf' },
    'IND 901/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['Av. Dr. Antônio Casagrande', 'Rua Benjamin Constant'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33485/cmbgind202500901a.pdf' },
    'IND 889/2025': { category: 'Gestão de Resíduos', locations: ['Travessa Moron n° 92'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33398/cmbgind202500889a.pdf' },
    'IND 884/2025': { category: 'Pavimentação e Vias', locations: ['Rua Ulisses Roman Ross'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33367/cmbgind202500884a.pdf' },
    'IND 857/2025': { category: 'Pavimentação e Vias', locations: ['Rua José Giovanini Filho', 'Bairro Licorsul'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33303/cmbgind202500857a.pdf' },
    'IND 856/2025': { category: 'Gestão de Resíduos', locations: ['Rua Sestílio Gasperi', 'bairro Humaitá'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33302/cmbgind202500856a.pdf' },
    'IND 854/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['Rua Pedro Menegotto Sobrinho', 'Bairro Licorsul'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33298/cmbgind202500854a.pdf' },
    'IND 841/2025': { category: 'Sinalização e Trânsito', locations: ['Rua Sestílio Gaspari', 'Bairro Humaitá'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33215/cmbgind202500841a.pdf' },
    'IND 839/2025': { category: 'Planejamento Urbano e Programas', locations: ['Rua Sestílio Gasperi', 'bairro Humaitá'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33211/cmbgind202500839a.pdf' },
    'IND 838/2025': { category: 'Iluminação Pública', locations: ['praça da Paróquia São Roque', 'av. São Roque', 'rua Ver. Loreno Menegotto'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33206/cmbgind202500838a.pdf' },
    'IND 837/2025': { category: 'Espaços Públicos e Infraestrutura', locations: ['praça no bairro Borgo', 'ruas Elias Luchese', 'Ângelo Tecchio'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33205/cmbgind202500837a.pdf' },
    'IND 836/2025': { category: 'Gestão de Resíduos', locations: ['Rua Artur Ziegler'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33202/cmbgind202500836a.pdf' },
    'IND 835/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['Rua José Giovanini Filho'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33198/cmbgind202500835a.pdf' },
    'IND 834/2025': { category: 'Iluminação Pública', locations: ['Praça do bairro Imigrante'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33197/cmbgind202500834a.pdf' },
    'IND 812/2025': { category: 'Planejamento Urbano e Programas', locations: ['Escola Municipal de Ensino Fundamental Professora Maria Borges Frota - CAIC'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33083/cmbgind202500812a.pdf' },
    'IND 799/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['Rua São Paulo', 'Rua Assis Brasil'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/33022/cmbgind202500799a.pdf' },
    'IND 798/2025': { category: 'Sinalização e Trânsito', locations: ['Rua Sestílio Gaspari', 'Bairro Humaitá', 'Residencial Melville 2'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32978/cmbgind202500798a.pdf' },
    'IND 793/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['Rua Assis Brasil', 'Rua José Mario Mônaco', 'Residencial Ilha Di Capri'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32937/cmbgind202500793a.pdf' },
    'IND 778/2025': { category: 'Pavimentação e Vias', locations: ['Rua Marques de Souza', 'Cemitério Público Municipal'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32874/cmbgind202500778a.pdf' },
    'IND 776/2025': { category: 'Pavimentação e Vias', locations: ['Ruas Assis Brasil', 'José Mário Mônaco'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32855/cmbgind202500776a.pdf' },
    'IND 756/2025': { category: 'Outros', locations: [], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32736/cmbgind202500756a.pdf' },
    'IND 749/2025': { category: 'Pavimentação e Vias', locations: ['Rua José Giovaninni Filho', 'bairro Licorsul'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32690/cmbgind202500749a.pdf' },
    'IND 738/2025': { category: 'Sinalização e Trânsito', locations: ['Rua Aristides Bertuol', 'Rua Domingos Antônio Cusin', 'Bairro Fenavinho'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32608/cmbgind202500738a.pdf' },
    'IND 705/2025': { category: 'Gestão de Resíduos', locations: ['Condomínio Edifício Tarsila', 'Rua Joaquim Manfredini', 'bairro Borgo'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32500/cmbgind202500705a.pdf' },
    'IND 685/2025': { category: 'Pavimentação e Vias', locations: ['rua Fortunato João Rizzardo', 'bairro Borgo'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32475/cmbgind202500685a.pdf' },
    'IND 582/2025': { category: 'Sinalização e Trânsito', locations: ['rua Dr. Aguinaldo da Silva Leal', 'rua Fernandes Vieira', 'bairro Cidade Alta'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32351/cmbgind202500582a.pdf' },
    'IND 546/2025': { category: 'Sinalização e Trânsito', locations: ['Rua Carlos Flores', 'R. Sen. Joaquim Pedro Salgado Filho', 'Rua Xingú', 'Rua Saldanha Marinho', 'Rua José Mário Mônaco'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32305/cmbgind202500546a.pdf' },
    'IND 521/2025': { category: 'Sinalização e Trânsito', locations: ['Rua Pe. João Scalabrini', 'bairro Botafogo'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32275/cmbgind202500521a.pdf' },
    'IND 505/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['rua Xingú', 'av. Planalto', 'bairro São Bento'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32256/cmbgind202500505a.pdf' },
    'IND 438/2025': { category: 'Pavimentação e Vias', locations: ['Rua Aurino Argemiro Zandonai', 'bairro Santa Marta'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32166/cmbgind202500438a.pdf' },
    'IND 418/2025': { category: 'Pavimentação e Vias', locations: ['Rua Vitório Carraro', 'Rua Nelson Carraro', 'Programa RECAP'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32138/cmbgind202500418a.pdf' },
    'IND 411/2025': { category: 'Sinalização e Trânsito', locations: ['Rua Presidente Costa e Silva'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32130/cmbgind202500411a.pdf' },
    'IND 379/2025': { category: 'Pavimentação e Vias', locations: ['Rua Domênico Zanetti', 'Rua Felice Pagot'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32087/cmbgind202500379a.pdf' },
    'IND 378/2025': { category: 'Sinalização e Trânsito', locations: ['Rua Mário Italvino Poletto', 'bairro Planalto'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32086/cmbgind202500378a.pdf' },
    'IND 358/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['rua Renato Menegotto', 'bairro Vila Nova I', 'igreja São Cristóvão'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32058/cmbgind202500358a.pdf' },
    'IND 342/2025': { category: 'Sinalização e Trânsito', locations: ['Haras Recanto Gaúcho'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32036/cmbgind202500342a.pdf' },
    'IND 341/2025': { category: 'Iluminação Pública', locations: ['Rua Ângelo Marcon', 'bairro São Roque'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32035/cmbgind202500341a.pdf' },
    'IND 339/2025': { category: 'Pavimentação e Vias', locations: ['Rua 7 de setembro', 'bairro Fenavinho'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32033/cmbgind202500339a.pdf' },
    'IND 336/2025': { category: 'Iluminação Pública', locations: ['Rua Fiorelo Ross', 'bairro Fenavinho'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32030/cmbgind202500336a.pdf' },
    'IND 332/2025': { category: 'Gestão de Resíduos', locations: ['campo do Grêmio Tuiuty'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32023/cmbgind202500332a.pdf' },
    'IND 329/2025': { category: 'Gestão de Resíduos', locations: ['tv. Juarez Postal', 'bairro Borgo'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32020/cmbgind202500329a.pdf' },
    'IND 327/2025': { category: 'Iluminação Pública', locations: ['Travessa Lucindo Ozelame', 'BR 470', 'trevo para Faria Lemos'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32018/cmbgind202500327a.pdf' },
    'IND 313/2025': { category: 'Iluminação Pública', locations: ['Via adjacente à BR 470', 'Distrito de Tuiuty'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/32000/cmbgind202500313a.pdf' },
    'IND 297/2025': { category: 'Manutenção e Limpeza Urbana', locations: ['Rua José Benedetti', 'bairro Salgado'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31979/cmbgind202500297a.pdf' },
    'IND 248/2025': { category: 'Iluminação Pública', locations: ['Rua Joaquim Manfredini', 'bairro Borgo'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31914/cmbgind202500248a.pdf' },
    'IND 224/2025': { category: 'Sinalização e Trânsito', locations: ['Rua Paulo Salton', 'bairro São Francisco'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31885/cmbgind202500224a.pdf' },
    'IND 205/2025': { category: 'Pavimentação e Vias', locations: ['Rua Fioravante Grando', 'bairro Borgo'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31865/cmbgind202500205a.pdf' },
    'IND 195/2025': { category: 'Sinalização e Trânsito', locations: ['rua Antônio Martineli, 571', 'Empresa FVA'], pdfUrl: 'https://sapl.camarabento.rs.gov.br/media/sapl/public/materialegislativa/2025/31855/cmbgind202500195a.pdf' },
};


type RawProposal = Omit<Proposal, 'category' | 'status' | 'locations'>;

function parseOcrTextForProposals(ocrText: string): RawProposal[] {
    const proposalBlocks = ocrText.split(/(?=IND \d+\/\d+ - Indicação\n)/).filter(block => block.trim() !== '');

    const proposals = proposalBlocks.map((block): RawProposal | null => {
        try {
            const idMatch = block.match(/(IND \d+\/\d+)/);
            const titleMatch = block.match(/(IND \d+\/\d+ - Indicação)/);
            const ementaMatch = block.match(/Ementa:\s*([\s\S]*?)(?=\n(?:Apresentação:|Protocolo:))/);
            const dateMatch = block.match(/Data Protocolo:.*?(\d{2}\/\d{2}\/\d{4})/);

            if (!idMatch || !titleMatch || !ementaMatch || !dateMatch) {
                console.warn("Bloco de proposta incompleto, pulando:", block.substring(0, 100));
                return null;
            }

            const id = idMatch[1];
            const title = titleMatch[1];
            const description = ementaMatch[1].replace(/\n/g, ' ').trim();
            const protocolDate = dateMatch[1];
            const year = parseInt(protocolDate.split('/')[2], 10);

            return {
                id,
                title,
                description,
                protocolDate,
                year,
                pdfUrl: '' // URL do PDF será adicionado depois
            };
        } catch (error) {
            console.error('Erro ao analisar bloco de proposta do OCR:', error);
            return null;
        }
    });

    return proposals.filter((p): p is RawProposal => p !== null);
}

export function processLegislativeText(): Proposal[] {
  
  const allRawProposals = parseOcrTextForProposals(ocrPdfText);

  if (allRawProposals.length === 0) {
      throw new Error("Nenhuma indicação foi encontrada no texto do documento para processar. A estrutura do texto pode ser inesperada.");
  }
  
  const uniqueProposalsMap = new Map<string, RawProposal>();
  allRawProposals.forEach(p => uniqueProposalsMap.set(p.id, p));
  const uniqueRawProposals = Array.from(uniqueProposalsMap.values());

  const proposals: Proposal[] = uniqueRawProposals.map(p => {
    const categorizedData = preCategorizedData[p.id];
    if (!categorizedData) {
        console.warn(`Dados de categoria não encontrados para a proposta ${p.id}. Usando fallback.`);
        return {
            ...p,
            category: 'Outros',
            locations: [],
            status: 'Ativo' as const,
            pdfUrl: '',
        };
    }
    return {
        ...p,
        ...categorizedData,
        status: 'Ativo' as const,
    };
  });
  
  proposals.sort((a, b) => {
    const dateA = a.protocolDate.split('/').reverse().join('-');
    const dateB = b.protocolDate.split('/').reverse().join('-');
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return proposals;
}

// Static data from PDF
const ocrPdfText = `
IND 194/2025 - Indicação
Ementa:
Solicita ao Poder Executivo, por meio da Secretaria de Gestão Integrada e Mobilidade Urbana, que sejam pintadas linhas de
estímulo à Redução de Velocidade (LRU) em frente à Empresa FVA, na rua Antônio Martineli, 571.
Apresentação: 26 de Fevereiro de 2025
Protocolo: 337/2025, Data Protocolo: 26/02/2025 - Horário: 18:09:53
Autor: Vereador Postal
IND 185/2025 - Indicação
Ementa:
Solicita ao Poder Executivo, por meio da Secretaria Municipal de Gestão Integrada e Mobilidade Urbana, a instalação de ondulação
transversal (lombada física) na rua Domênico Zanetti, Lot. Zanetti.
Apresentação: 26 de Fevereiro de 2025
Protocolo: 328/2025, Data Protocolo: 26/02/2025 - Horário: 16:11:01
Autor: Vereador Postal
IND 184/2025 - Indicação
Ementa:
Solicita ao Poder Executivo, por meio da Secretaria Competente, a edificação de saída de emergência no pavimento Superior da
Escola EMEF Professor Agostino Brun, no bairro Imigrante.
Apresentação: 26 de Fevereiro de 2025
Protocolo: 327/2025, Data Protocolo: 26/02/2025 - Horário: 16:07:40
Autor: Vereador Postal
IND 164/2025 - Indicação
Ementa:
Solicita ao Poder Executivo, por meio da Secretaria Municipal de Gestão Integrada e Mobilidade Urbana, a realização de pintura da
faixa de pedestres e inserção da respectiva placa sinalizadora na rua Júlio Lorenzoni esq. com rua Cavalheiro José Farina, em frente
ao logradouro n° 562, bairro Licorsul.
Apresentação: 21 de Fevereiro de 2025
Protocolo: 286/2025, Data Protocolo: 21/02/2025 - Horário: 8:31:24
Autor: Vereador Postal
IND 150/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, por meio das secretarias responsáveis, providências para a revitalização da Praça Pública
Piazza Arrivare, localizada na Rua Ângelo Luchese, em frente ao n° 711, bairro Barracão.
Apresentação: 18 de Fevereiro de 2025
Protocolo: 262/2025, Data Protocolo: 18/02/2025 - Horário: 11:15:56
Autor: Vereador Postal
IND 146/2025 - Indicação
Ementa:
Solicita ao Poder Executivo, por meio da Secretaria Municipal de Gestão Integrada e Mobilidade Urbana, a realização de pintura da
lombada existente na rua Eugênio Valduga, na altura do logradouro n° 336, bairro São Francisco, bem como a inserção de placa de
advertência e ampliação da colocação de tachões na referida via.
Apresentação: 14 de Fevereiro de 2025
Protocolo: 251/2025, Data Protocolo: 14/02/2025 - Horário: 14:32:45
Autor: Vereador Postal
IND 130/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, por meio da Secretaria de Meio Ambiente, roçada da vegetação que se encontra excessiva ao
longo de trecho do canteiro central da rua Visconde de São Gabriel.
Apresentação: 11 de Fevereiro de 2025
Protocolo: 225/2025, Data Protocolo: 11/02/2025 - Horário: 9:40:13
Autor: Vereador Postal
IND 122/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, por meio da Secretaria responsável, o pedido de conserto da boca de lobo na Rua Xingú, 559,
bairro São Bento, em frente ao escritório Martini Advogados.
Apresentação: 7 de Fevereiro de 2025
Protocolo: 213/2025, Data Protocolo: 07/02/2025 - Horário: 14:45:27
Autor: Vereador Postal
IND 105/2025 - Indicação
Ementa:
Solicita que se encaminhe para a Secretaria responsável, a criação de vaga em estacionamento de curta duração na rua Assis Brasil
em frente ao n° 132, bairro Centro.
Apresentação: 5 de Fevereiro de 2025
Protocolo: 183/2025, Data Protocolo: 05/02/2025 - Horário: 15:41:45
Autor: Vereador Postal
IND 104/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, por meio da Secretaria responsável, providências no sentido de sanar buraco na via, rua João
Domingos Polli, bairro Zatt, em frente aos logradouros n° 544 e 546.
Apresentação: 5 de Fevereiro de 2025
Protocolo: 181/2025, Data Protocolo: 05/02/2025 - Horário: 14:30:59
Autor: Vereador Postal
IND 99/2025 - Indicação
Ementa:
Solicito suas providências ao Poder Executivo Municipal, por meio da secretaria responsável, em relação às condições de
trafegabilidade ou à impossibilidade de trânsito no passeio público da Rua Cavalheiro José Farina, n.º 934 (ao lado da LS Bolsas).
Apresentação: 4 de Fevereiro de 2025
Protocolo: 166/2025, Data Protocolo: 04/02/2025 - Horário: 9:47:11
Autor: Vereador Postal
IND 98/2025 - Indicação
Ementa:
Solicita ao Poder Público Municipal, através da Secretaria Municipal de Gestão Integrada e Mobilidade Urbana, a troca de lâmpada
na esquina Joaquim Manfredini com a Cavalheiro José Farina, bairro São Francisco.
Apresentação: 3 de Fevereiro de 2025
Protocolo: 161/2025, Data Protocolo: 03/02/2025 - Horário: 14:17:35
Autor: Vereador Postal
IND 91/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, por meio da Secretaria de Viação e Obras Públicas, o conserto/reparação de pavimento na
Rua Batista Dosso, em frente ao nº 61 no bairro Santa Marta.
Apresentação: 31 de Janeiro de 2025
Protocolo: 148/2025, Data Protocolo: 31/01/2025 - Horário: 14:56:26
Autor: Vereador Postal
IND 90/2025 - Indicação
Ementa:
Solicita ao Poder Executivo, por meio da Secretaria Municipal de Viação e Obras, limpeza e reposição de meia-cana que dá
escoamento da água pluvial no trecho do início da RS-444 ao trevo de acesso ao Barracão.
Apresentação: 31 de Janeiro de 2025
Protocolo: 147/2025, Data Protocolo: 31/01/2025 - Horário: 13:40:55
Autor: Vereador Postal
IND 89/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, por meio da Secretaria de Viação e Obras Públicas, o conserto/reparação de pavimento na
Rua Batista Dosso, em frente ao n° 61 no bairro Santa Marta.
Apresentação: 31 de Janeiro de 2025
Protocolo: 146/2025, Data Protocolo: 31/01/2025 - Horário: 13:38:55
Autor: Vereador Postal
IND 64/2025 - Indicação
Ementa:
O vereador que abaixo subscreve, sugere ao Exmo. Sr. Prefeito Municipal Diogo Segabinazzi Siqueira, o presente Anteprojeto de Lei
Ordinária que "SUGERE AO PODER EXECUTIVO MUNICIPAL A CRIAÇÃO DE REGISTRO DETALHADO DAS MEDIDAS E LOCALIZAÇÕES
DE INFRAESTRUTURA HIDRÁULICA URBANA, E DÁ OUTRAS PROVIDÊNCIAS".
Apresentação: 27 de Janeiro de 2025
Protocolo: 111/2025, Data Protocolo: 27/01/2025 - Horário: 16:24:01
Autor: Vereador Postal
IND 55/2025 - Indicação
Ementa:
Solicita ao Poder Público Municipal, por meio da Secretaria de Gestão Integrada e Mobilidade Urbana, o conserto dos
paralelepipedos na Rua Fortunato João Rizzardo, bairro Borgo, em frente aos logradouros de n°s 180 e 202.
Apresentação: 24 de Janeiro de 2025
Protocolo: 95/2025, Data Protocolo: 24/01/2025 - Horário: 11:43:09
Autor: Vereador Postal
IND 52/2025 - Indicação
Ementa:
Solicita ao Prefeito Municipal, por meio da Secretaria Municipal de Meio Ambiente, a necessidade de realizar a poda de árvores ao
longo da ciclovia que compreende a rua Xingú, em frente aos nºs 521, 599; e av. Planalto, em frente às casas de n°s 718, 1044, е
1124, bairro São Bento.
Apresentação: 24 de Janeiro de 2025
Protocolo: 92/2025, Data Protocolo: 24/01/2025 - Horário: 11:27:59
Autor: Vereador Postal
IND 51/2025 - Indicação
Ementa:
Solicita ao Poder Público Municipal, através da Secretaria de Meio Ambiente, a recolocação de lixeira removida na Rua Herny Hugo
Dreher, próximo ao logradouro n° 92, bairro Planalto.
Apresentação: 24 de Janeiro de 2025
Protocolo: 91/2025, Data Protocolo: 24/01/2025 - Horário: 11:23:42
Autor: Vereador Postal
IND 47/2025 - Indicação
Ementa:
Indica ao Excelentíssimo Senhor Prefeito Municipal de Bento Gonçalves, a criação e implementação do programa "Via Livre",
destinado à utilização de via pública para atividades recreativas, culturais, esportivas e de lazer, mediante o fechamento parcial ou
total da Rua Xingú ao tráfego de veículos motorizados, em domingos e feriados das 7h às 12h da manhã.
Apresentação: 24 de Janeiro de 2025
Protocolo: 87/2025, Data Protocolo: 24/01/2025 - Horário: 11:05:04
Autor: Vereador Postal
IND 34/2025 - Indicação
Ementa:
Solicita ao Poder Executivo, por meio da Secretaria competente que realize estudo para o reparo do abrigo do Ponto de ônibus na
rua Marques de Souza, nº 773, bairro São Francisco, próximo ao cemitério público municipal.
Apresentação: 21 de Janeiro de 2025
Protocolo: 69/2025, Data Protocolo: 21/01/2025 - Horário: 16:39:32
Autor: Vereador Postal
IND 21/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, por meio da Secretaria Municipal de Meio Ambiente, a necessidade de realizar a poda da
vegetação localizada na Rua Mário Italvino Poleto, ao lado da casa n° 370, bairro Fenavinho.
Apresentação: 17 de Janeiro de 2025
Protocolo: 52/2025, Data Protocolo: 17/01/2025 - Horário: 14:11:10
Autor: Vereador Postal
IND 18/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, por meio da Secretaria de Gestão Integrada e Mobilidade Urbana, a reinstalação e fixação da
Placa Carga e descarga, localizada na Rua Assis Brasil, em frente ao número 881, no bairro São Francisco.
Apresentação: 16 de Janeiro de 2025
Protocolo: 49/2025, Data Protocolo: 16/01/2025 - Horário: 14:00:56
Autor: Vereador Postal
IND 16/2025 - Indicação
Ementa:
O Vereador que a esta subscreve indica ao Poder Executivo Municipal, por meio da Secretaria de Gestão Integrada e Mobilidade
Urbana, a necessidade de substituição de lâmpada queimada na Rua 13 de maio, esquina com rua Xingú, bairro São Bento, CEP
95703-154.
Apresentação: 15 de Janeiro de 2025
Protocolo: 45/2025, Data Protocolo: 15/01/2025 - Horário: 11:32:20
Autor: Vereador Postal
IND 15/2025 - Indicação
Ementa:
O Vereador que a esta subscreve indica ao Poder Executivo Municipal, por meio da Secretaria de Gestão Integrada e Mobilidade
Urbana, a necessidade de substituição de lâmpada queimada na travessa Juarez Postal, n° 151, bairro Borgo, CEP 95705-450.
Apresentação: 15 de Janeiro de 2025
Protocolo: 44/2025, Data Protocolo: 15/01/2025 - Horário: 11:27:12
Autor: Vereador Postal
IND 14/2025 - Indicação
Ementa:
O Vereador que a esta subscreve indica ao Poder Executivo Municipal, por meio da Secretaria de Gestão Integrada e Mobilidade
Urbana, a necessidade de substituição de lâmpada queimada na travessa Juarez Postal, esquina com rua Marcos Pedro Flaiban, CEP
95705-450.
Apresentação: 15 de Janeiro de 2025
Protocolo: 43/2025, Data Protocolo: 15/01/2025 - Horário: 11:20:34
Autor: Vereador Postal
IND 13/2025 - Indicação
Ementa:
O Vereador que a esta subscreve indica ao Poder Executivo Municipal, por meio da Secretaria de Gestão Integrada e Mobilidade
Urbana, a necessidade de substituição de duas lâmpadas queimadas na rua Garibaldi, 559, CEP 95703-062, em frente ao SUSFA.
Apresentação: 15 de Janeiro de 2025
Protocolo: 42/2025, Data Protocolo: 15/01/2025 - Horário: 11:15:58
Autor: Vereador Postal
IND 6/2025 - Indicação
Ementa:
O Vereador que a esta subscreve, solicita ao Prefeito Municipal, por meio da Secretaria Municipal de Meio Ambiente, o reparo ou
substituição da lixeira de tamanho container localizado na Rua Assis Brasil, n° 115, bairro Centro, CEP 95700-028.
Apresentação: 10 de Janeiro de 2025
Protocolo: 28/2025, Data Protocolo: 10/01/2025 - Horário: 15:21:24
Autor: Vereador Postal
IND 5/2025 - Indicação
Ementa:
O Vereador que a esta subscreve, solicita ao Prefeito Municipal, por meio da Secretaria Municipal de Meio Ambiente, o reparo ou
substituição da lixeira de tamanho container localizado na Av. Dr. Casagrande, próximo à esquina com Rua Olavo Bilac, bairro
Centro, CEP 95700-342.
Apresentação: 10 de Janeiro de 2025
Protocolo: 27/2025, Data Protocolo: 10/01/2025 - Horário: 15:18:51
Autor: Vereador Postal
IND 4/2025 - Indicação
Ementa:
O Vereador que a esta subscreve indica ao Poder Executivo Municipal, por meio da Secretaria de Gestão Integrada e Mobilidade
Urbana, a necessidade de realizar a substituição de lâmpada queimada na Rua Luís Neves, em frente ao logradouro 350, bairro
Borgo, CEP 95.705-480.
Apresentação: 9 de Janeiro de 2025
Protocolo: 23/2025, Data Protocolo: 09/01/2025 - Horário: 15:59:50
Autor: Vereador Postal
IND 3/2025 - Indicação
Ementa:
O Vereador que a esta subscreve indica ao Poder Executivo Municipal, por meio da Secretaria de Gestão Integrada e Mobilidade
Urbana, a necessidade de substituição de lâmpada queimada na Rua Ângela Tecchio, n° 315, bairro Borgo, CEP 95705-494.
Apresentação: 9 de Janeiro de 2025
Protocolo: 22/2025, Data Protocolo: 09/01/2025 - Horário: 15:56:00
Autor: Vereador Postal
IND 964/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria competente, providências quanto à tubulação de águas pluviais na Rua
João Casagrande, nº 495 - Bairro Imigrante.
Apresentação: 1 de Agosto de 2025
Protocolo: 1514/2025, Data Protocolo: 01/08/2025 - Horário: 15:08:59
Autor: Vereador Postal
IND 924/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria competente providências para reparar buraco no cruzamento das ruas
Ângelo Marcon com Avelino Menegotto.
Apresentação: 28 de Julho de 2025
Protocolo: 1464/2025, Data Protocolo: 28/07/2025 - Horário: 10:49:25
Autor: Vereador Postal
IND 915/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria competente a disponibilização de container para lixo reciclável na Rua
Pedro Rosa.
Apresentação: 25 de Julho de 2025
Protocolo: 1449/2025, Data Protocolo: 25/07/2025 - Horário: 16:20:50
Autor: Vereador Postal
IND 901/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria competente a substituição de gradil na boca de lobo da Av. Dr. Antônio
Casagrande esquina com a Rua Benjamin Constant.
Apresentação: 25 de Julho de 2025
Protocolo: 1431/2025, Data Protocolo: 25/07/2025 - Horário: 8:08:40
Autor: Vereador Postal
IND 889/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria competente providências quanto a descarte irregular de material de obra
misturada a lixo na Travessa Moron n° 92.
Apresentação: 23 de Julho de 2025
Protocolo: 1415/2025, Data Protocolo: 23/07/2025 - Horário: 15:54:25
Autor: Vereador Postal
IND 884/2025 - Indicação
Ementa:
Solicita ao Poder Público Municipal através da Secretaria competente a realização de obras de recuperação do pavimento asfáltico
da Rua Ulisses Roman Ross, em praticamente toda a sua extensão.
Apresentação: 23 de Julho de 2025
Protocolo: 1410/2025, Data Protocolo: 23/07/2025 - Horário: 13:18:34
Autor: Vereador Postal
IND 857/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria competente providências quanto a pavimentação asfáltica na Rua José
Giovanini Filho próximo ao nº 58, Bairro Licorsul
Apresentação: 22 de Julho de 2025
Protocolo: 1379/2025, Data Protocolo: 22/07/2025 - Horário: 13:16:42
Autor: Vereador Postal
IND 856/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria competente providências quanto a descarte irregular de lixo ao final da
Rua Sestílio Gasperi, no bairro Humaitá.
Apresentação: 22 de Julho de 2025
Protocolo: 1378/2025, Data Protocolo: 22/07/2025 - Horário: 13:14:17
Autor: Vereador Postal
IND 854/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria competente providências quanto as bocas de lobo na Rua Pedro
Menegotto Sobrinho em frente ao nº 156 no Bairro Licorsul.
Apresentação: 22 de Julho de 2025
Protocolo: 1376/2025, Data Protocolo: 22/07/2025 - Horário: 11:53:05
Autor: Vereador Postal
IND 841/2025 - Indicação
Ementa:
Solicitação de reposição e readequação de placa de carga e descarga – Rua Sestílio Gaspari, Bairro Humaitá.
Apresentação: 21 de Julho de 2025
Protocolo: 1353/2025, Data Protocolo: 21/07/2025 - Horário: 10:55:15
Autor: Vereador Postal
IND 839/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através das Secretarias competentes estudos e providências para abertura da continuidade da
Rua Sestílio Gasperi bairro Humaitá.
Apresentação: 21 de Julho de 2025
Protocolo: 1351/2025, Data Protocolo: 21/07/2025 - Horário: 10:47:41
Autor: Vereador Postal
IND 838/2025 - Indicação
Ementa:
Indica ao Prefeito Municipal, por meio da Secretaria de Gestão Integrada e Mobilidade Urbana, a necessidade de recuperar as
condições de iluminação e salubridade da esquina da praça da Paróquia São Roque, na av. São Roque com rua Ver. Loreno
Menegotto.
Apresentação: 21 de Julho de 2025
Protocolo: 1350/2025, Data Protocolo: 21/07/2025 - Horário: 10:20:58
Autor: Vereador Postal
IND 837/2025 - Indicação
Ementa:
O vereador Sidnei Postal, PL, solicita ao Poder Executivo Municipal através das Secretarias competentes, melhorias na praça
localizada no bairro Borgo, ladeada pelas ruas Elias Luchese e Ângelo Tecchio.
Apresentação: 21 de Julho de 2025
Protocolo: 1349/2025, Data Protocolo: 21/07/2025 - Horário: 10:17:05
Autor: Vereador Postal
IND 836/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria competente a destinação de um contâneir para lixo reciclável e um para
lixo orgânico na Rua Artur Ziegler nas proximidades do nº 319.
Apresentação: 21 de Julho de 2025
Protocolo: 1348/2025, Data Protocolo: 21/07/2025 - Horário: 10:13:54
Autor: Vereador Postal
IND 835/2025 - Indicação
Ementa:
Solicitação de fiscalização e providências – dano em calçada possivelmente decorrente de canalização de rede de água da Rua José
Giovanini Filho em frente ao nº 334.
Apresentação: 21 de Julho de 2025
Protocolo: 1347/2025, Data Protocolo: 21/07/2025 - Horário: 9:49:55
Autor: Vereador Postal
IND 834/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria competente troca de lâmpadas na Praça do bairro Imigrante.
Apresentação: 21 de Julho de 2025
Protocolo: 1346/2025, Data Protocolo: 21/07/2025 - Horário: 9:44:59
Autor: Vereador Postal
IND 812/2025 - Indicação
Ementa:
Sugere ao Exmo. Sr. Prefeito Municipal, Diogo Segabinazzi Siqueira, o presente Anteprojeto de Lei Ordinária que "Institui o
Programa de Escola Cívico-Militar Municipal (PECIM) na Escola Municipal de Ensino Fundamental Professora Maria Borges Frota -
CAIC."
Apresentação: 16 de Julho de 2025
Protocolo: 1310/2025, Data Protocolo: 16/07/2025 - Horário: 11:29:22
Autor: Vereador Postal
IND 799/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria competente providências quanto a tampas de acesso às galerias pluviais
Rua São Paulo x Rua Assis Brasil.
Apresentação: 11 de Julho de 2025
Protocolo: 1278/2025, Data Protocolo: 11/07/2025 - Horário: 16:20:55
Autor: Vereador Postal
IND 798/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal a reposição e readequação de placa de carga e descarga – Rua Sestílio Gaspari, Bairro Humaitá
em frente ao Residencial Melville 2.
Apresentação: 11 de Julho de 2025
Protocolo: 1276/2025, Data Protocolo: 11/07/2025 - Horário: 12:23:09
Autor: Vereador Postal
IND 793/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria Competente que determine a empresa terceirizada da Corsan a
desobstrução de boca de lobo na esquina da Rua Assis Brasil com Rua José Mario Mônaco, bem como na Rua Assis Brasil, nº 255,
em frente ao Residencial Ilha Di Capri.
Apresentação: 11 de Julho de 2025
Protocolo: 1270/2025, Data Protocolo: 11/07/2025 - Horário: 7:57:02
Autor: Vereador Postal
IND 778/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria Competente providências quanto ao reparo do asfalto em frente ao
abrigo de ônibus na Rua Marques de Souza frontalmente ao Cemitério Público Municipal.
Apresentação: 9 de Julho de 2025
Protocolo: 1249/2025, Data Protocolo: 09/07/2025 - Horário: 16:38:04
Autor: Vereador Postal
IND 776/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, através da Secretaria Competente, que determine à Corsan a recomposição da camada
asfáltica na esquina das Ruas Assis Brasil com José Mário Mônaco em frente ao nº 16.
Apresentação: 9 de Julho de 2025
Protocolo: 1247/2025, Data Protocolo: 09/07/2025 - Horário: 13:30:25
Autor: Vereador Postal
IND 756/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através do Órgão de Defesa do Consumidor (PROCON) a atuação desse órgão de defesa do
consumidor quanto às recorrentes irregularidades observadas em redes de supermercados no município.
Apresentação: 7 de Julho de 2025
Protocolo: 1218/2025, Data Protocolo: 07/07/2025 - Horário: 14:07:17
Autor: Vereador Postal
IND 749/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria competente a solução de buraco de grande profundidade na Rua José
Giovaninni Filho, em frente ao logradouro n° 29, bairro Licorsul.
Apresentação: 4 de Julho de 2025
Protocolo: 1210/2025, Data Protocolo: 04/07/2025 - Horário: 15:50:31
Autor: Vereador Postal
IND 738/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, através da Secretaria competente, a confecção de faixa de pedestre na Rua Aristides Bertuol,
na intersecção com a Rua Domingos Antônio Cusin, Bairro Fenavinho.
Apresentação: 3 de Julho de 2025
Protocolo: 1191/2025, Data Protocolo: 03/07/2025 - Horário: 8:17:59
Autor: Vereador Postal
IND 705/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria do Meio Ambiente a colocação de dois containers para atender
moradores do Condomínio Edifício Tarsila da Rua Joaquim Manfredini, nº 260, bairro Borgo.
Apresentação: 24 de Junho de 2025
Protocolo: 1142/2025, Data Protocolo: 24/06/2025 - Horário: 15:53:47
Autor: Vereador Postal
IND 685/2025 - Indicação
Ementa:
Solicita ao Prefeito Municipal, por meio da Secretaria de Viação e Obras Públicas, o reparo dos paralelepipedos na rua Fortunato
João Rizzardo, em frente ao número 85, bairro Borgo.
Apresentação: 18 de Junho de 2025
Protocolo: 1111/2025, Data Protocolo: 18/06/2025 - Horário: 8:19:55
Autor: Vereador Postal
IND 582/2025 - Indicação
Ementa:
Indica ao Poder Executivo Municipal, por meio da Secretaria de Gestão Integrada e Mobilidade Urbana, a necessidade de inserção
de ondulação transversal de trânsito na rua Dr. Aguinaldo da Silva Leal, esquina com rua Fernandes Vieira, bairro Cidade Alta.
Apresentação: 30 de Maio de 2025
Protocolo: 956/2025, Data Protocolo: 30/05/2025 - Horário: 8:10:51
Autor: Vereador Postal
IND 546/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal que encaminhe a Secretaria de Mobilidade Urbana a pintura de Marcação de Área de Conflito
nos Cruzamentos das ruas 1. Carlos Flores com R. Sen. Joaquim Pedro Salgado Filho; 2. da Rua Carlos Flores com Rua Xingú; e 3. da
Rua Saldanha Marinho com Rua José Mário Mônaco.
Apresentação: 21 de Maio de 2025
Protocolo: 902/2025, Data Protocolo: 21/05/2025 - Horário: 9:44:19
Autor: Vereador Postal
IND 521/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria de Mobilidade Urbana providências quanto ao estacionamento na Rua
Pe. João Scalabrini, bairro Botafogo.
Apresentação: 15 de Maio de 2025
Protocolo: 863/2025, Data Protocolo: 15/05/2025 - Horário: 8:03:19
Autor: Vereador Postal
IND 505/2025 - Indicação
Ementa:
Solicita ao Prefeito Municipal, por meio da Secretaria Municipal de Meio Ambiente, a realização de poda das árvores ao longo da
ciclovia que compreende a rua Xingú e av. Planalto, bairro São Bento, a fim de recuperar sua funcionalidade.
Apresentação: 12 de Maio de 2025
Protocolo: 836/2025, Data Protocolo: 12/05/2025 - Horário: 14:25:32
Autor: Vereador Postal
IND 438/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria Competente providências relacionadas a pavimentação na Rua Aurino
Argemiro Zandonai, bairro Santa Marta
Apresentação: 11 de Abril de 2025
Protocolo: 710/2025, Data Protocolo: 11/04/2025 - Horário: 15:47:15
Autor: Vereador Postal
IND 418/2025 - Indicação
Ementa:
Solicita ao Poder Público Municipal que solicite a Corsan o recapeamento da Rua Vitório Carraro e Nelson Carraro através do
Programa RECAP.
Apresentação: 8 de Abril de 2025
Protocolo: 681/2025, Data Protocolo: 08/04/2025 - Horário: 15:59:24
Autor: Vereador Postal
IND 411/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal que encaminhe a Secretaria Competente a substituição de placa de sinalização de trânsito na
esquina da Rua Presidente Costa e Silva.
Apresentação: 7 de Abril de 2025
Protocolo: 666/2025, Data Protocolo: 07/04/2025 - Horário: 8:59:58
Autor: Vereador Postal
IND 379/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, através da Secretaria competente, melhorias na pavimentação da Rua Domênico Zanetti,
cruzamento com a Rua Felice Pagot.
Apresentação: 27 de Março de 2025
Protocolo: 614/2025, Data Protocolo: 27/03/2025 - Horário: 15:56:58
Autor: Vereador Postal
IND 378/2025 - Indicação
Ementa:
Solicita ao Poder Público Municipal através da Secretaria de Mobilidade Urbana a criação de vaga de "Carga e Descarga" na Rua
Mário Italvino Poletto em frente ao n° 277 bairro Planalto.
Apresentação: 27 de Março de 2025
Protocolo: 613/2025, Data Protocolo: 27/03/2025 - Horário: 15:46:37
Autor: Vereador Postal
IND 358/2025 - Indicação
Ementa:
Solicita ao Poder Público, por meio da Secretaria Municipal de Meio Ambiente, a poda e roçada de excesso de vegetação ea
remoção de entulhos na rua Renato Menegotto, bairro Vila Nova I, ao lado da igreja São Cristóvão.
Apresentação: 24 de Março de 2025
Protocolo: 581/2025, Data Protocolo: 24/03/2025 - Horário: 8:39:19
Autor: Vereador Postal
IND 342/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, por meio da Secretaria de Gestão Integrada e Mobilidade Urbana, a pintura de meio-fio na via
rural em frente ao estabelecimento Haras Recanto Gaúcho.
Apresentação: 19 de Março de 2025
Protocolo: 556/2025, Data Protocolo: 19/03/2025 - Horário: 15:41:33
Autor: Vereador Postal
IND 341/2025 - Indicação
Ementa:
Solicita ao Poder Público Municipal através da Secretaria de Gestão Integrada e Mobilidade Urbana, a troca de lâmpada, reator ou
fotocélula na Rua Ângelo Marcon, nº 581, bairro São Roque.
Apresentação: 19 de Março de 2025
Protocolo: 555/2025, Data Protocolo: 19/03/2025 - Horário: 15:38:17
Autor: Vereador Postal
IND 339/2025 - Indicação
Ementa:
Solicita ao Poder Público Municipal através da Secretaria Competente o conserto com devida "URGÊNCIA", de buraco existente na
Rua 7 de setembro, bairro Fenavinho.
Apresentação: 19 de Março de 2025
Protocolo: 553/2025, Data Protocolo: 19/03/2025 - Horário: 15:33:03
Autor: Vereador Postal
IND 336/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal através da Secretaria de Gestão Integrada e Mobilidade Urbana, a substituição de lâmpada na
Rua Fiorelo Ross, nº 133, bairro Fenavinho.
Apresentação: 19 de Março de 2025
Protocolo: 550/2025, Data Protocolo: 19/03/2025 - Horário: 15:24:39
Autor: Vereador Postal
IND 332/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, através da Secretaria de Meio Ambiente, providências relacionadas à coleta de lixo próxima
ao campo do Grêmio Tuiuty.
Apresentação: 18 de Março de 2025
Protocolo: 538/2025, Data Protocolo: 18/03/2025 - Horário: 15:33:13
Autor: Vereador Postal
IND 329/2025 - Indicação
Ementa:
Solicita ao Poder Executivo, por meio da Secretaria Municipal de Meio Ambiente, a movimentação dos Containers de lixo na tv.
Juarez Postal, nº 74, bairro Borgo.
Apresentação: 18 de Março de 2025
Protocolo: 535/2025, Data Protocolo: 18/03/2025 - Horário: 15:26:49
Autor: Vereador Postal
IND 327/2025 - Indicação
Ementa:
Solicita ao Poder Executivo, por meio da Secretaria Municipal de Gestão Integrada e Mobilidade Urbana, a substituição de lâmpada
queimada na Travessa Lucindo Ozelame, BR 470, próximo ao trevo para Faria Lemos.
Apresentação: 18 de Março de 2025
Protocolo: 533/2025, Data Protocolo: 18/03/2025 - Horário: 15:22:43
Autor: Vereador Postal
IND 313/2025 - Indicação
Ementa:
Solicita ao Poder Executivo, por meio da Secretaria Municipal de Gestão Integrada e Mobilidade Urbana, a troca de lâmpadas de
iluminação pública na Via adjacente à BR 470 em frente ao CRD 00111 no Distrito de Tuiuty.
Apresentação: 17 de Março de 2025
Protocolo: 515/2025, Data Protocolo: 17/03/2025 - Horário: 8:22:52
Autor: Vereador Postal
IND 297/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, através das secretarias competentes, a desobstrução da tubulação de água pluvial da Rua
José Benedetti, nº 1627, bairro Salgado.
Apresentação: 13 de Março de 2025
Protocolo: 489/2025, Data Protocolo: 13/03/2025 - Horário: 9:59:52
Autor: Vereador Postal
IND 248/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, através da Secretaria competente, a substituição de lâmpada na Rua Joaquim Manfredini em
frente ao logradouro nº 67, bairro Borgo.
Apresentação: 6 de Março de 2025
Protocolo: 404/2025, Data Protocolo: 06/03/2025 - Horário: 8:24:59
Autor: Vereador Postal
IND 224/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, através da Secretaria competente, colocar placa de 'Carga e Descarga' na Rua Paulo Salton, n°
865, bairro São Francisco.
Apresentação: 27 de Fevereiro de 2025
Protocolo: 375/2025, Data Protocolo: 27/02/2025 - Horário: 16:25:12
Autor: Vereador Postal
IND 205/2025 - Indicação
Ementa:
Solicita ao Poder Executivo Municipal, encaminhar à Secretaria competente, para que realize aplicação de camada asfáltica ou
concreto na Rua Fioravante Grando próximo ao nº 205, bairro Borgo.
Apresentação: 27 de Fevereiro de 2025
Protocolo: 348/2025, Data Protocolo: 27/02/2025 - Horário: 8:29:38
Autor: Vereador Postal
IND 195/2025 - Indicação
Ementa:
Solicita ao Poder Executivo, por meio da Secretaria de Gestão Integrada e Mobilidade Urbana, que sejam pintadas linhas de
estímulo à Redução de Velocidade (LRU) em frente à Empresa FVA, na rua Antônio Martineli, 571.
Apresentação: 26 de Fevereiro de 2025
Protocolo: 338/2025, Data Protocolo: 26/02/2025 - Horário: 18:16:16
Autor: Vereador Postal
`;
