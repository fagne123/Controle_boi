import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import Animal from '@/lib/models/Animal';
import Custo from '@/lib/models/Custo';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo();
    
    const animal = await Animal.findById(params.id).lean();
    
    if (!animal) {
      return NextResponse.json(
        { error: 'Animal não encontrado' },
        { status: 404 }
      );
    }
    
    // Buscar custos do animal
    const custos = await Custo.find({ animalId: params.id }).lean();
    
    return NextResponse.json({
      ...animal,
      custos: custos.map(custo => ({
        ...custo,
        _id: String(custo._id),
        animalId: String(custo.animalId)
      }))
    });
    
  } catch (error) {
    console.error('Erro ao buscar animal:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const animal = await Animal.findByIdAndUpdate(
      params.id,
      {
        tipo: body.tipo,
        dataCompra: new Date(body.dataCompra),
        valorCompra: parseFloat(body.valorCompra),
        dataVenda: body.dataVenda ? new Date(body.dataVenda) : null,
        valorVenda: body.valorVenda ? parseFloat(body.valorVenda) : null,
        pesoAbate: body.pesoAbate ? parseFloat(body.pesoAbate) : null,
        valorMercado: body.valorMercado ? parseFloat(body.valorMercado) : null,
        status: body.status || 'ativo'
      },
      { new: true, runValidators: true }
    );
    
    if (!animal) {
      return NextResponse.json(
        { error: 'Animal não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(animal);
    
  } catch (error) {
    console.error('Erro ao atualizar animal:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    
    // Deletar custos associados
    await Custo.deleteMany({ animalId: params.id });
    
    // Deletar animal
    await Animal.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'Animal deletado com sucesso' });
    
  } catch (error) {
    console.error('Erro ao deletar animal:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 