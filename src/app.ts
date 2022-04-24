import express, { Application, Request, Response } from 'express'
import CSVParser from './parser/csv-parser';

const app: Application = express()

const port: number = 3001

app.get('/jobs', async (req: Request, res: Response) => {

    const csvParser = new CSVParser();
    const data = await csvParser.parseJobs();

    res.send(data)
})

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})