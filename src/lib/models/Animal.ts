import mongoose, { Schema, Document } from 'mongoose';

export interface IAnimal extends Document {
  tipo: string;
  dataCompra: Date;
  valorCompra: number;
  dataVenda?: Date;
  valorVenda?: number;
  pesoAbate?: number;
  valorMercado?: number;
  status: 'ativo' | 'vendido';
  createdAt: Date;
  updatedAt: Date;
}

const AnimalSchema = new Schema<IAnimal>({
  tipo: {
    type: String,
    required: [true, 'Tipo do animal é obrigatório'],
    trim: true
  },
  dataCompra: {
    type: Date,
    required: [true, 'Data de compra é obrigatória']
  },
  valorCompra: {
    type: Number,
    required: [true, 'Valor de compra é obrigatório'],
    min: [0, 'Valor de compra deve ser maior ou igual a zero']
  },
  dataVenda: {
    type: Date,
    default: null
  },
  valorVenda: {
    type: Number,
    default: null,
    min: [0, 'Valor de venda deve ser maior ou igual a zero']
  },
  pesoAbate: {
    type: Number,
    default: null,
    min: [0, 'Peso no abate deve ser maior ou igual a zero']
  },
  valorMercado: {
    type: Number,
    default: null,
    min: [0, 'Valor de mercado deve ser maior ou igual a zero']
  },
  status: {
    type: String,
    enum: ['ativo', 'vendido'],
    default: 'ativo'
  }
}, {
  timestamps: true
});

// Índices para melhor performance
AnimalSchema.index({ status: 1 });
AnimalSchema.index({ tipo: 1 });
AnimalSchema.index({ dataCompra: 1 });

export default mongoose.models.Animal || mongoose.model<IAnimal>('Animal', AnimalSchema); 