export interface Animal {
  _id?: string;
  tipo: string;
  dataCompra: Date;
  valorCompra: number;
  dataVenda?: Date;
  valorVenda?: number;
  pesoAbate?: number;
  valorMercado?: number;
  custos: Custo[];
  status: 'ativo' | 'vendido';
  createdAt: Date;
  updatedAt: Date;
}

export interface Custo {
  _id?: string;
  animalId: string;
  data: Date;
  valor: number;
  categoria: 'alimentacao' | 'vacinas' | 'medicamentos' | 'outros';
  descricao: string;
  createdAt: Date;
}

export interface Configuracao {
  _id?: string;
  tiposAnimais: string[];
  caixa: number;
  investimentoAdicional: number;
  updatedAt: Date;
}

export interface DashboardIndicadores {
  patrimonioTotal: number;
  valorInvestidoAtual: number;
  custosTotais: number;
  lucroBrutoTotal: number;
  lucroLiquidoTotal: number;
  roiMedio: number;
  caixa: number;
  quantidadeAnimais: number;
  quantidadeVendidos: number;
}

export interface FluxoCaixa {
  data: string;
  entradas: number;
  saidas: number;
  saldo: number;
} 