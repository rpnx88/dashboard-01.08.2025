
export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  year: number;
  status: 'Ativo' | 'Inativo';
  protocolDate: string;
  pdfUrl: string;
  locations?: string[];
}

export interface CategoryData {
  name: string;
  count: number;
  percentage: number;
  fill: string;
}
