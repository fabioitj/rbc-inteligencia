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
  haswon: number;
  operator: string;
  nbkills: number;
  isdead: number;
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

const matchSchema: Schema = new Schema({
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
  haswon: { type: Number, required: true },
  operator: { type: String, required: true },
  nbkills: { type: Number, required: true },
  isdead: { type: Number, required: true },
  weights: {
    platform: { type: Number, required: true, default: 0.05 },
    gamemode: { type: Number, required: true, default: 0.1 },
    mapname: { type: Number, required: true, default: 0.1 },
    roundnumber: { type: Number, required: true, default: 0.03 },
    objectivelocation: { type: Number, required: true, default: 0.02 },
    endroundreason: { type: Number, required: true, default: 0.1 },
    roundduration: { type: Number, required: true, default: 0.03 },
    clearencelevel: { type: Number, required: true, default: 0.02 },
    skillrank: { type: Number, required: true, default: 0.2 },
    role: { type: Number, required: true, default: 0.1 },
    haswon: { type: Number, required: true, default: 0.1 },
    operator: { type: Number, required: true, default: 0.1 },
    nbkills: { type: Number, required: true, default: 0.03 },
    isdead: { type: Number, required: true, default: 0.02 },
  },
});

const Match = mongoose.model<Match>('Match', matchSchema);

export default Match;
