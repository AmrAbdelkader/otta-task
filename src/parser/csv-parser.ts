const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
import { Job } from '../models/job';
import { Reaction } from '../models/reaction';

class CSVParser {

    parseJobs(): Promise<Array<Job>> {
        return new Promise(function (resolve, reject) {
            try{
                const jobsData: Array<Job> = [];
                fs.createReadStream(process.cwd() + '/src/data/jobs.csv')
                .pipe(csv())
                .on('data', (data: Job) => {
                    const parsedData: Job = {
                        job_id: Number(data.job_id),
                        company_id: Number(data.company_id),
                    }
                    jobsData.push(parsedData);
                })
                .on('end', () => resolve(jobsData));
            }catch(err){
                reject(err);
            }
        });
    }

    parseReactions(): Promise<Array<Reaction>> {
        return new Promise(function (resolve, reject) {
            try{
                const reactionsData: Array<Reaction> = [];
                fs.createReadStream(process.cwd() + '/src/data/reactions.csv')
                .pipe(csv())
                .on('data', (data: any) => {
                    const parsedReaction: Reaction = {
                        user_id: Number(data.user_id),
                        job_id: Number(data.job_id),
                        direction: JSON.parse(data.direction),
                        time: data.time
                    }
                    reactionsData.push(parsedReaction);
                })
                .on('end', () => resolve(reactionsData));
            }catch(err){
                reject(err);
            }
        });
    }

}

export default CSVParser;