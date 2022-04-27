import express, { Application, Request, Response } from 'express'
import { Reaction } from './models/reaction';
import { SimilarityScore } from './models/similarityscore';
import CSVParser from './parser/csv-parser';
import SimilarityScoreService from './services/similarity-score.service';

const app: Application = express()

const port: number = 3001

app.get('/users', async (req: Request, res: Response) => {

    const simScoreService = new SimilarityScoreService();
    const highScore = await simScoreService.getHighestUsersSimilarityScore();
    res.send(`Highiest users similrity score are user: ${highScore.peer1_id} and user: ${highScore.peer2_id} with score: ${highScore.score}`);
});

app.get('/companies', async (req: Request, res: Response) => {

    const simScoreService = new SimilarityScoreService();
    const highScore = await simScoreService.getHighestCompaniesSimilarityScore();
    res.send(`Highiest companies similrity score are company: ${highScore.peer1_id} and company: ${highScore.peer2_id} with score: ${highScore.score}`);
});

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})