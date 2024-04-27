import mongoose, { Schema, Document } from 'mongoose';

interface Match extends Document {
  platform: string;
  gamemode: string;
  mapname: string;
  roundnumber: number;
  objectivelocation: string;
  endroundreason: string;
  roundduration: number;
  clearencelevel: number;
  skillrank: string;
  role: string;
  haswon: boolean;
  operator: string;
  nbkills: number;
  isdead: boolean;
  weights: {
    platform: number;
    gamemode: number;
    mapname: number;
    roundnumber: number;
    objectivelocation: number;
    endroundreason: number;
    roundduration: number;
    clearencelevel: number;
    skillrank: number;
    role: number;
    haswon: number;
    operator: number;
    nbkills: number;
    isdead: number;
  }
}

const casoMedicoSchema: Schema = new Schema({
  platform: { type: String, required: true },
  gamemode: { type: String, required: true },
  mapname: { type: String, required: true },
  roundnumber: { type: Number, required: true },
  objectivelocation: { type: String, required: true },
  endroundreason: { type: String, required: true },
  roundduration: { type: Number, required: true },
  clearencelevel: { type: Number, required: true },
  skillrank: { type: String, required: true },
  role: { type: String, required: true },
  haswon: { type: Boolean, required: true },
  operator: { type: String, required: true },
  nbkills: { type: Number, required: true },
  isdead: { type: Boolean, required: true },
  weights: {
    platform: { type: Number, required: true, default: 0. },
    gamemode: { type: Number, required: true, default: 0. },
    mapname: { type: Number, required: true, default: 0. },
    roundnumber: { type: Number, required: true, default: 0. },
    objectivelocation: { type: Number, required: true, default: 0. },
    endroundreason: { type: Number, required: true, default: 0. },
    roundduration: { type: Number, required: true, default: 0. },
    clearencelevel: { type: Number, required: true, default: 0. },
    skillrank: { type: Number, required: true, default: 0. },
    role: { type: Number, required: true, default: 0. },
    haswon: { type: Number, required: true, default: 0. },
    operator: { type: Number, required: true, default: 0. },
    nbkills: { type: Number, required: true, default: 0. },
    isdead: { type: Number, required: true, default: 0. },
  },
});

const CasoMedicoModel = mongoose.model<Match>('CasoMedico', casoMedicoSchema);

export default CasoMedicoModel;
