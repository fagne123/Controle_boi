import { Animal, Custo } from '@/types';

/**
 * Calcula o lucro bruto de um animal
 */
export function calcularLucroBruto(animal: Animal): number {
  if (!animal.valorVenda) return 0;
  return animal.valorVenda - animal.valorCompra;
}

/**
 * Calcula o lucro líquido de um animal (lucro bruto - custos)
 */
export function calcularLucroLiquido(animal: Animal, custos: Custo[]): number {
  const lucroBruto = calcularLucroBruto(animal);
  const custosTotais = custos.reduce((sum, custo) => sum + custo.valor, 0);
  return lucroBruto - custosTotais;
}

/**
 * Calcula o ROI (Return on Investment) de um animal
 */
export function calcularROI(animal: Animal, custos: Custo[]): number {
  const lucroLiquido = calcularLucroLiquido(animal, custos);
  if (animal.valorCompra === 0) return 0;
  return (lucroLiquido / animal.valorCompra) * 100;
}

/**
 * Calcula o tempo de investimento em dias
 */
export function calcularTempoInvestimento(animal: Animal): number {
  const dataFinal = animal.dataVenda || new Date();
  const diffTime = Math.abs(dataFinal.getTime() - animal.dataCompra.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formata valor monetário para exibição
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

/**
 * Formata data para exibição (DD/MM/AAAA)
 */
export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(data);
}

/**
 * Formata percentual para exibição
 */
export function formatarPercentual(valor: number): string {
  return `${valor.toFixed(2)}%`;
}

/**
 * Calcula o patrimônio total
 */
export function calcularPatrimonioTotal(animais: Animal[], caixa: number): number {
  const valorAnimais = animais
    .filter(a => a.status === 'ativo')
    .reduce((sum, animal) => sum + animal.valorCompra, 0);
  return valorAnimais + caixa;
}

/**
 * Calcula o valor investido atual
 */
export function calcularValorInvestidoAtual(animais: Animal[]): number {
  return animais
    .filter(a => a.status === 'ativo')
    .reduce((sum, animal) => sum + animal.valorCompra, 0);
}

/**
 * Calcula custos totais
 */
export function calcularCustosTotais(custos: Custo[]): number {
  return custos.reduce((sum, custo) => sum + custo.valor, 0);
}

/**
 * Calcula lucro bruto total
 */
export function calcularLucroBrutoTotal(animais: Animal[]): number {
  return animais
    .filter(a => a.status === 'vendido' && a.valorVenda)
    .reduce((sum, animal) => sum + (animal.valorVenda! - animal.valorCompra), 0);
}

/**
 * Calcula ROI médio
 */
export function calcularROIMedio(animais: Animal[], custos: Custo[]): number {
  const animaisComCustos = animais.map(animal => {
    const custosAnimal = custos.filter(c => c.animalId === animal._id);
    return { animal, custos: custosAnimal };
  });

  const rois = animaisComCustos
    .filter(({ animal }) => animal.status === 'vendido')
    .map(({ animal, custos }) => calcularROI(animal, custos));

  if (rois.length === 0) return 0;
  
  const roiMedio = rois.reduce((sum, roi) => sum + roi, 0) / rois.length;
  return roiMedio;
} 