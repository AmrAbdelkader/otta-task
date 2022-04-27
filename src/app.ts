import express, { Application, Request, Response } from 'express'
import { Reaction } from './models/reaction';
import { SimilarityScore } from './models/similarityscore';
import CSVParser from './parser/csv-parser';

const app: Application = express()

const port: number = 3001

const getSimilarityScore = (user1Likes: any, user2Likes: any) => {
    return user1Likes.filter((item: any) => user2Likes.includes(item)).length;
}

app.get('/reacts', async (req: Request, res: Response) => {

    const csvParser = new CSVParser();
    const data = await csvParser.parseReactions();

    //1- filter out unliked jobs and only select user_id and job_id
    const likedJobs = data.filter(r => r.direction).map( ({ user_id, job_id }) => ({user_id, job_id}));

    //2- group jobs likes by user_id
    const groups = groupBy(likedJobs, (r: Reaction) => r.user_id);

    //3- Build similarity score collection
    // Similarity score collection should be looking like: 
    // [
    //     {"user1": 1, "user2": 2, "similarityScore": 5},
    //     {"user1": 1, "user2": 3, "similarityScore": 8},
    //     {"user1": 2, "user2": 3, "similarityScore": 1}
    // ]
    const similarityScoreCollection: Array<SimilarityScore> = [];

    Object.keys(groups).forEach((user1: any) => {
        Object.keys(groups).forEach((user2: any) => {
            // filter out duplicate users or comparing a user to itself
            if(user1 !== user2){
                const similarityObj: SimilarityScore = { 
                    user1_id: user1,
                    user2_id: user2,
                    score: getSimilarityScore(groups[user1], groups[user2])
                };
                similarityScoreCollection.push(similarityObj);
            }
        });
    });

    //4- find the max score and print it
    res.send(getMaxScore(similarityScoreCollection));
})

const getMaxScore = (items: Array<SimilarityScore>) => {
    let maxScoreItem: SimilarityScore = { score: 0};

    items.forEach(item => {
        if(item.score > maxScoreItem.score)
            maxScoreItem = item;
    });

    return maxScoreItem;
}

const groupBy = (data: any, field: any) => data.reduce((a: any, b: any) => ((a[field(b)] ||= []).push(b.job_id), a), {});

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})