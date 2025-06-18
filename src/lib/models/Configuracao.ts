import mongoose, { Schema, Document } from 'mongoose';

export interface IConfiguracao extends Document {
  tiposAnimais: string[];
  caixa: number;
  investimentoAdicional: number;
  updatedAt: Date;
}

const ConfiguracaoSchema = new Schema<IConfiguracao>({
  tiposAnimais: {
    type: [String],
    default: ['Garrote', 'Boi', 'Novilha', 'Bezerro', 'Vaca', 'Vaca c/ Bezerro'],
    validate: {
      validator: function(v: string[]) {
        return v.length > 0;
      },
      message: 'Deve haver pelo menos um tipo de animal'
    }
  },
  caixa: {
    type: Number,
    default: 0,
    min: [0, 'Caixa não pode ser negativo']
  },
  investimentoAdicional: {
    type: Number,
    default: 0,
    min: [0, 'Investimento adicional não pode ser negativo']
  }
}, {
  timestamps: true
});

// Garantir que só existe uma configuração
ConfiguracaoSchema.index({}, { unique: true });

export default mongoose.models.Configuracao || mongoose.model<IConfiguracao>('Configuracao', ConfiguracaoSchema); 