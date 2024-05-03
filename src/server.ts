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

app.post('/match', async (req: Request, res: Response) => {
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
		console.error('Erro ao adicionar partida:', error);
		res.status(500).send({ error: 'Erro interno ao adicionar partida.' });
	}
});

app.get('/match/:id', async (req: Request, res: Response) => {
	try {
		const partidaBase = await Match.findById(req.params.id);

		if (!partidaBase) {
			return res.status(404).send({ error: 'Partida não encontrada.' });
		}

		const partidas = await Match.find().limit(100000);

		const partidasParaComparar = partidas.filter(partida => partida._id.toString() !== partidaBase._id.toString());

		const partidasComSimilaridade = partidasParaComparar.map((partida: Match) => ({
			partida,
			similaridade: calculateSimilarity(<MatchModel>{
				platform: partidaBase.platform,
				gamemode: partidaBase.gamemode,
				mapname: partidaBase.mapname,
				roundnumber: partidaBase.roundnumber,
				objectivelocation: partidaBase.objectivelocation,
				endroundreason: partidaBase.endroundreason,
				roundduration: partidaBase.roundduration,
				clearencelevel: partidaBase.clearencelevel,
				skillrank: partidaBase.skillrank,
				role: partidaBase.role,
				haswon: partidaBase.haswon,
				operator: partidaBase.operator,
				nbkills: partidaBase.nbkills,
				isdead: partidaBase.isdead,
				weights: partidaBase.weights
			}, <MatchModel>{
				platform: partida.platform,
				gamemode: partida.gamemode,
				mapname: partida.mapname,
				roundnumber: partida.roundnumber,
				objectivelocation: partida.objectivelocation,
				endroundreason: partida.endroundreason,
				roundduration: partida.roundduration,
				clearencelevel: partida.clearencelevel,
				skillrank: partida.skillrank,
				role: partida.role,
				haswon: partida.haswon,
				operator: partida.operator,
				nbkills: partida.nbkills,
				isdead: partida.isdead,
				weights: partida.weights
			}),
		}));

		partidasComSimilaridade.sort((a, b) => b.similaridade - a.similaridade);

		res.status(200).send(partidasComSimilaridade.slice(0, 20));
	} catch (error) {
		console.error('Erro ao buscar partidas médicos:', error);
		res.status(500).send({ error: 'Erro interno ao buscar partidas médicos.' });
	}
});

app.post('/match/data', async (req: Request, res: Response) => {
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

		const partidas = await Match.find().limit(100000);

		const partidasComSimilaridade = partidas.map((partida: Match) => ({
			partida,
			similaridade: calculateSimilarity(<MatchModel>{
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
				isdead,
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
			}, <MatchModel>{
				platform: partida.platform,
				gamemode: partida.gamemode,
				mapname: partida.mapname,
				roundnumber: partida.roundnumber,
				objectivelocation: partida.objectivelocation,
				endroundreason: partida.endroundreason,
				roundduration: partida.roundduration,
				clearencelevel: partida.clearencelevel,
				skillrank: partida.skillrank,
				role: partida.role,
				haswon: partida.haswon,
				operator: partida.operator,
				nbkills: partida.nbkills,
				isdead: partida.isdead,
				weights: partida.weights
			}),
		}));

		partidasComSimilaridade.sort((a, b) => b.similaridade - a.similaridade);

		res.status(200).send(partidasComSimilaridade.slice(0, 20));
	} catch (error) {
		console.error('Failed to update weights:', error);
	}
});

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
