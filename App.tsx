
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { processLegislativeText } from './services/geminiService';
import { Proposal, CategoryData } from './types';

const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#14b8a6', // teal-500
  '#8b5cf6', // violet-500
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#22c55e', // green-500
  '#ec4899', // pink-500
  '#6b7280', // gray-500
  '#d946ef', // fuchsia-500 for "Outros"
];

const CATEGORY_ORDER = [
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

// --- Helper Components ---

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex justify-center items-center h-screen bg-red-900/20">
    <div className="text-center p-8 bg-slate-800 rounded-lg shadow-xl max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Ocorreu um Erro</h2>
      <p className="text-gray-300 break-words">{message}</p>
    </div>
  </div>
);

const DocumentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />
    </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

const ProposalCard: React.FC<{ proposal: Proposal; index: number }> = ({ proposal, index }) => (
    <div
        className="bg-slate-800 rounded-lg p-5 shadow-lg flex flex-col justify-between animate-fade-in-up transition-transform duration-300 hover:transform hover:-translate-y-1"
        style={{ animationDelay: `${index * 50}ms` }}
    >
        <div>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-blue-400 pr-2">{proposal.title}</h3>
                <span className="bg-teal-900 text-teal-300 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">{proposal.category}</span>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{proposal.description}</p>
        </div>
        <div className="mt-auto pt-4 border-t border-slate-700/70 space-y-3">
             {proposal.locations && proposal.locations.length > 0 && (
                <div>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                        <LocationIcon className="h-5 w-5 mr-2 text-violet-400 flex-shrink-0" />
                        <span className="font-medium">Locais Mencionados:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {proposal.locations.map((location, i) => (
                            <span key={i} className="bg-slate-700 text-gray-300 text-xs font-medium px-2 py-1 rounded-md">
                                {location}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex items-center justify-between text-sm text-gray-400">
                <span className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-teal-400" />
                    <span>{proposal.protocolDate}</span>
                </span>
                <a
                    href={proposal.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium text-blue-500 hover:text-blue-400 transition-colors"
                >
                    <DocumentIcon className="h-5 w-5 mr-1" />
                    Ver Documento
                </a>
            </div>
        </div>
    </div>
);


const App: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await processLegislativeText();
        setProposals(data);
        setError(null);
      } catch (e: any) {
        console.error("Error processing data in component:", e);
        setError(e.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBarClick = useCallback((payload: any) => {
    if (payload && payload.name) {
      setSelectedCategory(prev => (prev === payload.name ? null : prev));
      listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);
  
  const handleClearFilter = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const filteredProposals = useMemo(() => {
    if (!selectedCategory) {
      return proposals;
    }
    return proposals.filter(p => p.category === selectedCategory);
  }, [proposals, selectedCategory]);

  const categoryData: CategoryData[] = useMemo(() => {
    const totalCount = proposals.length;
    if (totalCount === 0) return [];
    
    const counts = CATEGORY_ORDER.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {} as Record<string, number>);

    proposals.forEach(p => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    return CATEGORY_ORDER.map((name, index) => ({
      name,
      count: counts[name],
      percentage: totalCount > 0 ? (counts[name] / totalCount) * 100 : 0,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    })).filter(item => item.count > 0);
  }, [proposals]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 p-4 sm:p-6 lg:p-8 animate-fade-in">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
          Dashboard Legislativo
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          Análise interativa das indicações legislativas do Vereador Postal na Câmara de Bento Gonçalves, RS, em 2024.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-slate-800/50 p-6 rounded-xl shadow-2xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-2xl font-bold text-white mb-4">Propostas por Categoria</h2>
          <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={110}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                    contentStyle={{
                      background: 'rgba(30, 41, 59, 0.9)',
                      borderColor: '#475569',
                      borderRadius: '0.5rem',
                      color: '#e5e7eb',
                    }}
                    formatter={(value: number, name, props) => [`${props.payload.count} propostas (${value.toFixed(1)}%)`, 'Porcentagem']}
                    labelFormatter={(label) => <span className="font-bold">{label}</span>}
                  />
                  <Bar dataKey="percentage" onClick={handleBarClick} className="cursor-pointer">
                     <LabelList dataKey="count" position="right" style={{ fill: 'white', fontSize: 12 }} />
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        opacity={selectedCategory === null || selectedCategory === entry.name ? 1 : 0.3}
                        className="transition-opacity"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          </div>
        </section>

        <section className="flex flex-col animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="mb-4 h-14 flex items-center">
              {selectedCategory ? (
                <div className="flex items-center justify-between w-full">
                    <div className="text-sm text-gray-400">
                      Filtrando por:
                      <span className="ml-2 bg-blue-900 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">{selectedCategory}</span>
                      <span className="ml-2">({filteredProposals.length} resultados)</span>
                    </div>
                    <button
                        onClick={handleClearFilter}
                        className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                    >
                        Limpar filtro
                    </button>
                </div>
              ) : (
                <h2 className="text-2xl font-bold text-white">Todas as Propostas ({proposals.length})</h2>
              )}
          </div>
          <div ref={listRef} className="flex-1 bg-slate-800/50 p-4 rounded-xl shadow-inner overflow-y-auto space-y-4" style={{maxHeight: '70vh'}} role="feed">
              {filteredProposals.length > 0 ? (
                  filteredProposals.map((proposal, index) => (
                      <ProposalCard key={proposal.id} proposal={proposal} index={index} />
                  ))
              ) : (
                  <div className="text-center py-10 text-gray-500">
                      <p className="text-lg">Nenhuma proposta encontrada.</p>
                      {selectedCategory && <p>Tente limpar a seleção de categoria.</p>}
                  </div>
              )}
          </div>
        </section>
      </main>
      <footer className="text-center text-gray-500 mt-8 text-sm">
        <p>Dados extraídos do SAPL da Câmara de Bento Gonçalves, RS. Última atualização em {new Date().toLocaleDateString('pt-BR')}.</p>
        <p>Análise e categorização realizadas com Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
