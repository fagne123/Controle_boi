import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import Configuracao from '@/lib/models/Configuracao';

export async function GET() {
  try {
    await connectMongo();
    
    let config = await Configuracao.findOne().lean();
    
    // Se não existir configuração, criar uma padrão
    if (!config) {
      const novaConfig = new Configuracao({
        tiposAnimais: ['Garrote', 'Boi', 'Novilha', 'Bezerro', 'Vaca', 'Vaca c/ Bezerro'],
        caixa: 0,
        investimentoAdicional: 0
      });
      
      await novaConfig.save();
      config = novaConfig.toObject();
    }
    
    return NextResponse.json(config);
    
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectMongo();
    
    const body = await request.json();
    
    // Validações básicas
    if (!body.tiposAnimais || !Array.isArray(body.tiposAnimais)) {
      return NextResponse.json(
        { error: 'Tipos de animais deve ser um array' },
        { status: 400 }
      );
    }
    
    if (body.tiposAnimais.length === 0) {
      return NextResponse.json(
        { error: 'Deve haver pelo menos um tipo de animal' },
        { status: 400 }
      );
    }
    
    // Buscar configuração existente ou criar nova
    let config = await Configuracao.findOne();
    
    if (!config) {
      config = new Configuracao();
    }
    
    // Atualizar configuração
    config.tiposAnimais = body.tiposAnimais;
    config.caixa = body.caixa || 0;
    config.investimentoAdicional = body.investimentoAdicional || 0;
    
    await config.save();
    
    return NextResponse.json(config);
    
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 