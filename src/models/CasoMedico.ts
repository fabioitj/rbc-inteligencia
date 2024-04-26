import mongoose, { Schema, Document } from 'mongoose';

interface CasoMedico extends Document {
  idade: number;
  genero: string;
  sintomas: string[];
  historicoMedico: string[];
  resultadosExames: Record<string, string>;
  diagnostico: string;
  pesos: {
    idade: number;
    genero: number;
    sintomas: number;
    historicoMedico: number;
    resultadosExames: number;
  };
}

const casoMedicoSchema: Schema = new Schema({
  idade: { type: Number, required: true },
  genero: { type: String, required: true },
  sintomas: { type: [String], required: true },
  historicoMedico: { type: [String], required: true },
  resultadosExames: { type: Schema.Types.Mixed, required: true },
  diagnostico: { type: String, required: true },
  pesos: {
    idade: { type: Number, required: true },
    genero: { type: Number, required: true },
    sintomas: { type: Number, required: true },
    historicoMedico: { type: Number, required: true },
    resultadosExames: { type: Number, required: true },
  },
});

const CasoMedicoModel = mongoose.model<CasoMedico>('CasoMedico', casoMedicoSchema);

export default CasoMedicoModel;
