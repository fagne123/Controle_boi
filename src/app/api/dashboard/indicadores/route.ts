import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import Animal from '@/lib/models/Animal';
import Custo from '@/lib/models/Custo';
import Configuracao from '@/lib/models/Configuracao';

export async function GET() {
  try {
    await connectMongo();
    
    // Buscar todos os animais
    const animais = await Animal.find().lean();
    
    // Buscar configurações
    const config = await Configuracao.findOne().lean();
    const caixa = config && typeof config === 'object' && 'caixa' in config ? config.caixa : 0;
    
    // Calcular indicadores
    const animaisAtivos = animais.filter(a => a.status === 'ativo');
    const animaisVendidos = animais.filter(a => a.status === 'vendido');
    
    // Valor investido atual (animais ativos)
    const valorInvestidoAtual = animaisAtivos.reduce((sum, animal) => {
      return sum + animal.valorCompra;
    }, 0);
    
    // Custos totais
    const custosTotais = await Custo.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$valor' }
        }
      }
    ]);
    const totalCustos = custosTotais.length > 0 ? custosTotais[0].total : 0;
    
    // Lucro bruto total (vendas - compras)
    const lucroBrutoTotal = animaisVendidos.reduce((sum, animal) => {
      if (animal.valorVenda) {
        return sum + (animal.valorVenda - animal.valorCompra);
      }
      return sum;
    }, 0);
    
    // Lucro líquido total (lucro bruto - custos)
    const lucroLiquidoTotal = lucroBrutoTotal - totalCustos;
    
    // ROI médio
    const roiMedio = valorInvestidoAtual > 0 ? (lucroLiquidoTotal / valorInvestidoAtual) * 100 : 0;
    
    // Patrimônio total
    const patrimonioTotal = valorInvestidoAtual + caixa;
    
    const indicadores = {
      patrimonioTotal: Number(patrimonioTotal.toFixed(2)),
      valorInvestidoAtual: Number(valorInvestidoAtual.toFixed(2)),
      custosTotais: Number(totalCustos.toFixed(2)),
      lucroBrutoTotal: Number(lucroBrutoTotal.toFixed(2)),
      lucroLiquidoTotal: Number(lucroLiquidoTotal.toFixed(2)),
      roiMedio: Number(roiMedio.toFixed(2)),
      caixa: Number(caixa.toFixed(2)),
      quantidadeAnimais: animaisAtivos.length,
      quantidadeVendidos: animaisVendidos.length
    };
    
    return NextResponse.json(indicadores);
    
  } catch (error) {
    console.error('Erro ao calcular indicadores:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 