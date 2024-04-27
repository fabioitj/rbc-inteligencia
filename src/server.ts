import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import CasoMedico from './models/CasoMedico';
import { CasoMedicoModel, calcularSimilaridadePonderada } from './utils/SimilaridadePonderada';

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect("mongodb+srv://rbcunivali:oQNsQavxqxzWbLwv@rbc.oc3iv9p.mongodb.net/?retryWrites=true&w=majority&appName=RBC");

console.log("Conectou no banco de dados!");

app.use(cors());
app.use(bodyParser.json());

app.post('/casos', async (req: Request, res: Response) => {
    try {
      const { idade, genero, sintomas, historicoMedico, resultadosExames, diagnostico, pesos } = req.body;
  
      if (!idade || !genero || !sintomas || !historicoMedico || !resultadosExames || !diagnostico || !pesos) {
        return res.status(400).send({ error: 'Todos os campos são obrigatórios.' });
      }
  
      const novoCaso = new CasoMedico({
        idade,
        genero,
        sintomas,
        historicoMedico,
        resultadosExames,
        diagnostico,
        pesos
      });
  
      await novoCaso.save();
  
      res.status(201).send(novoCaso); 
    } catch (error) {
      console.error('Erro ao adicionar caso:', error);
      res.status(500).send({ error: 'Erro interno ao adicionar caso.' });
    }
  });

  app.get('/casos/:id', async (req: Request, res: Response) => {
      try {
      const casoBase = await CasoMedico.findById(req.params.id);
  
      if (!casoBase) {
          return res.status(404).send({ error: 'Caso médico não encontrado.' });
      }
  
      const casos = await CasoMedico.find();

      const casosParaComparar = casos.filter(caso => caso._id.toString() !== casoBase._id.toString());

      const casosComSimilaridade = casosParaComparar.map((caso: CasoMedicoModel) => ({
          caso,
          similaridade: calcularSimilaridadePonderada(casoBase, caso),
      }));
  
      casosComSimilaridade.sort((a, b) => b.similaridade - a.similaridade);
  
      res.status(200).send(casosComSimilaridade);
      } catch (error) {
      console.error('Erro ao buscar casos médicos:', error);
      res.status(500).send({ error: 'Erro interno ao buscar casos médicos.' });
      }
  });

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
