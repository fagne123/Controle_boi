import mongoose, { Schema, Document } from 'mongoose';

export interface ICusto extends Document {
  animalId: mongoose.Types.ObjectId;
  data: Date;
  valor: number;
  categoria: 'alimentacao' | 'vacinas' | 'medicamentos' | 'outros';
  descricao: string;
  createdAt: Date;
}

const CustoSchema = new Schema<ICusto>({
  animalId: {
    type: Schema.Types.ObjectId,
    ref: 'Animal',
    required: [true, 'ID do animal é obrigatório']
  },
  data: {
    type: Date,
    required: [true, 'Data do custo é obrigatória']
  },
  valor: {
    type: Number,
    required: [true, 'Valor do custo é obrigatório'],
    min: [0, 'Valor do custo deve ser maior ou igual a zero']
  },
  categoria: {
    type: String,
    enum: ['alimentacao', 'vacinas', 'medicamentos', 'outros'],
    required: [true, 'Categoria do custo é obrigatória']
  },
  descricao: {
    type: String,
    required: [true, 'Descrição do custo é obrigatória'],
    trim: true,
    maxlength: [500, 'Descrição não pode ter mais de 500 caracteres']
  }
}, {
  timestamps: true
});

// Índices para melhor performance
CustoSchema.index({ animalId: 1 });
CustoSchema.index({ data: 1 });
CustoSchema.index({ categoria: 1 });

export default mongoose.models.Custo || mongoose.model<ICusto>('Custo', CustoSchema); 