import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MatchModel, calculateSimilarity } from './utils/SimilaridadePonderada';
import Match from './models/Match';

const app = express();
const port = process.env.PORT || 5000;
const uri = "mongodb+srv://rbcunivali:oQNsQavxqxzWbLwv@rbc.oc3iv9p.mongodb.net/?retryWrites=true&w=majority&appName=RBC";

mongoose.connect(uri);

console.log("Conectou no banco de dados!");

app.use(cors());
app.use(bodyParser.json());

  app.post('/casos', async (req: Request, res: Response) => {
    try {
      const {
        platform,
        gamemode,
        mapname,
        roundnumber,
        objectivelocation,
        endroundreason,
        roundduration,
        clearencelevel,
        skillrank,
        role,
        haswon,
        operator,
        nbkills,
        isdead
      } = req.body;

      console.log(req.body);
  
      if (!platform || !gamemode || !mapname || !roundnumber || !objectivelocation || !endroundreason || !roundduration || !clearencelevel || !skillrank || !role || (haswon !== 0 && haswon !== 1) || !operator || !nbkills || (isdead !== 0 && isdead !== 1)) {
        return res.status(400).send({ error: 'Todos os campos são obrigatórios.' });
      }
  
      const matchModel = new Match({
        platform,
        gamemode,
        mapname,
        roundnumber,
        objectivelocation,
        endroundreason,
        roundduration,
        clearencelevel,
        skillrank,
        role,
        haswon,
        operator,
        nbkills,
        isdead
      });
  
      await matchModel.save();
  
      res.status(201).send(matchModel);
    } catch (error) {
      console.error('Erro ao adicionar caso:', error);
      res.status(500).send({ error: 'Erro interno ao adicionar caso.' });
    }
  });

  app.get('/casos/:id', async (req: Request, res: Response) => {
      try {
      const casoBase = await Match.findById(req.params.id);
  
      if (!casoBase) {
          return res.status(404).send({ error: 'Caso médico não encontrado.' });
      }
  
      const casos = await Match.find();

      const casosParaComparar = casos.filter(caso => caso._id.toString() !== casoBase._id.toString());

      const casosComSimilaridade = casosParaComparar.map((caso: Match) => ({
          caso,
          similaridade: calculateSimilarity(casoBase, caso),
      }));
  
      casosComSimilaridade.sort((a, b) => b.similaridade - a.similaridade);
  
      res.status(200).send(casosComSimilaridade.slice(0, 20));
      } catch (error) {
      console.error('Erro ao buscar casos médicos:', error);
      res.status(500).send({ error: 'Erro interno ao buscar casos médicos.' });
      }
  });

  app.put('/casos', async (req: Request, res: Response) => {
    try {
      const updateResult = await Match.updateMany({}, {
        $set: {
          weights: {
            platform: 0.05,
            gamemode: 0.1,
            mapname: 0.1,
            roundnumber: 0.03,
            objectivelocation: 0.02,
            endroundreason: 0.1,
            roundduration: 0.03,
            clearencelevel: 0.02,
            skillrank: 0.2,
            role: 0.1,
            haswon: 0.1,
            operator: 0.1,
            nbkills: 0.03,
            isdead: 0.02
          }
        }
      });
  
      console.log(`Updated ${updateResult.modifiedCount} documents`);
    } catch (error) {
      console.error('Failed to update weights:', error);
    }
    res.status(200).json({success: true});
  });

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
