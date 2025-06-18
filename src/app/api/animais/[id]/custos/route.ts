import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import Custo from '@/lib/models/Custo';
import Animal from '@/lib/models/Animal';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo();
    
    // Verificar se o animal existe
    const animal = await Animal.findById(params.id);
    if (!animal) {
      return NextResponse.json(
        { error: 'Animal não encontrado' },
        { status: 404 }
      );
    }
    
    const custos = await Custo.find({ animalId: params.id })
      .sort({ data: -1 })
      .lean();
    
    return NextResponse.json(custos.map(custo => ({
      ...custo,
      _id: String(custo._id),
      animalId: String(custo.animalId)
    })));
    
  } catch (error) {
    console.error('Erro ao buscar custos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo();
    
    // Verificar se o animal existe
    const animal = await Animal.findById(params.id);
    if (!animal) {
      return NextResponse.json(
        { error: 'Animal não encontrado' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Validações básicas
    if (!body.data || !body.valor || !body.categoria || !body.descricao) {
      return NextResponse.json(
        { error: 'Data, valor, categoria e descrição são obrigatórios' },
        { status: 400 }
      );
    }
    
    const custo = new Custo({
      animalId: params.id,
      data: new Date(body.data),
      valor: parseFloat(body.valor),
      categoria: body.categoria,
      descricao: body.descricao
    });
    
    await custo.save();
    
    return NextResponse.json(custo, { status: 201 });
    
  } catch (error) {
    console.error('Erro ao criar custo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 