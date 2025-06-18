import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import Animal from '@/lib/models/Animal';
import Custo from '@/lib/models/Custo';

export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const status = searchParams.get('status');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Construir filtros
    const filtros: Record<string, unknown> = {};
    
    if (tipo) filtros.tipo = tipo;
    if (status) filtros.status = status;
    if (dataInicio || dataFim) {
      filtros.dataCompra = {};
      if (dataInicio) (filtros.dataCompra as Record<string, Date>).$gte = new Date(dataInicio);
      if (dataFim) (filtros.dataCompra as Record<string, Date>).$lte = new Date(dataFim);
    }
    
    // Buscar animais com paginação
    const skip = (page - 1) * limit;
    const animais = await Animal.find(filtros)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Buscar custos para cada animal
    const animaisComCustos = await Promise.all(
      animais.map(async (animal) => {
        const custos = await Custo.find({ animalId: animal._id }).lean();
        return {
          ...animal,
          custos: custos.map(custo => ({
            ...custo,
            _id: String(custo._id),
            animalId: String(custo.animalId)
          }))
        };
      })
    );
    
    // Contar total de registros
    const total = await Animal.countDocuments(filtros);
    
    return NextResponse.json({
      animais: animaisComCustos,
      paginacao: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar animais:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    
    const body = await request.json();
    
    // Validações básicas
    if (!body.tipo || !body.dataCompra || !body.valorCompra) {
      return NextResponse.json(
        { error: 'Tipo, data de compra e valor de compra são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Criar animal
    const animal = new Animal({
      tipo: body.tipo,
      dataCompra: new Date(body.dataCompra),
      valorCompra: parseFloat(body.valorCompra),
      dataVenda: body.dataVenda ? new Date(body.dataVenda) : null,
      valorVenda: body.valorVenda ? parseFloat(body.valorVenda) : null,
      pesoAbate: body.pesoAbate ? parseFloat(body.pesoAbate) : null,
      valorMercado: body.valorMercado ? parseFloat(body.valorMercado) : null,
      status: body.status || 'ativo'
    });
    
    await animal.save();
    
    return NextResponse.json(animal, { status: 201 });
    
  } catch (error) {
    console.error('Erro ao criar animal:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 