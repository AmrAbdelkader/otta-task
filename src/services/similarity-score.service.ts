const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
import { Reaction } from '../models/reaction';
import { SimilarityScore } from '../models/similarityscore';
import CSVParser from '../parser/csv-parser';

class SimilarityScoreService {

    async getHighestUsersSimilarityScore() {

        const csvParser = new CSVParser();
        const data = await csvParser.parseReactions();

        //1- filter out unliked jobs and only select user_id and job_id
        const likedJobs = data.filter(r => r.direction).map(({ user_id, job_id }) => ({ user_id, job_id }));

        //2- group jobs likes by user_id
        const groups = groupBy(likedJobs, (r: Reaction) => r.user_id, 'job_id');

        //3- Build similarity score collection
        // Similarity score collection should be looking like: 
        // [
        //     {"user1": 1, "user2": 2, "similarityScore": 5},
        //     {"user1": 1, "user2": 3, "similarityScore": 8},
        //     {"user1": 2, "user2": 3, "similarityScore": 1}
        // ]
        const simScoreCollection = buildSimilarityScoreCollection(groups);

        return getMaxScore(simScoreCollection);
    }

    async getHighestCompaniesSimilarityScore() {

        //1 merge Reactions and Jobs into one collection
        const joinedData = await this.mergeReactionsAndJobs();

        //2- filter out the noise, by removing unliked jobs, and then removing the jobs column as its not needed,
        // since we only need to know which company has been liked at least once.
        const filteredData = joinedData.filter(r => r.direction === true).map(({ user_id, company_id }) => ({ user_id, company_id }));

        //3- group jobs likes by company_id
        const groups = groupBy(filteredData, (r: Reaction) => r.company_id, 'user_id');

        //4- build similarity score collection
        const simScoreCollection = buildSimilarityScoreCollection(groups);

        //5- finally get the highest score
        const highestScore = getMaxScore(simScoreCollection);

        return highestScore;
    }

    async mergeReactionsAndJobs() {
        const csvParser = new CSVParser();
    
        //1- parse reactions file
        const reactionsData = await csvParser.parseReactions();
    
        //2- parse companies file
        const jobsData = await csvParser.parseJobs();
    
        //3- merge both of them into Reactions collection
    
        return reactionsData.map((r: Reaction) => {
            const foundJob = jobsData.find(j => r.job_id === j.job_id);
            return {
                ...r,
                company_id: foundJob?.company_id
            }
        });
    }

}

const getMaxScore = (items: Array<SimilarityScore>) => {
    let maxScoreItem: SimilarityScore = { score: 0 };

    items.forEach(item => {
        if (item.score > maxScoreItem.score)
            maxScoreItem = item;
    });

    return maxScoreItem;
}

const buildSimilarityScoreCollection = (groups: any) => {
    const similarityScoreCollection: Array<SimilarityScore> = [];

    Object.keys(groups).forEach((peer1: any) => {
        Object.keys(groups).forEach((peer2: any) => {
            // filter out duplicate users or comparing a user to itself
            if (peer1 !== peer2) {
                const similarityObj: SimilarityScore = {
                    peer1_id: peer1,
                    peer2_id: peer2,
                    score: getSimilarityScore(groups[peer1], groups[peer2])
                };
                similarityScoreCollection.push(similarityObj);
            }
        });
    });

    return similarityScoreCollection;
}

const groupBy = (data: any, groupByField: any, selectedColumn?: any) => data.reduce((a: any, b: any) => ((a[groupByField(b)] ||= []).push(b[selectedColumn]), a), {});

const getSimilarityScore = (leftCollection: any, rightCollection: any) => {
    return leftCollection.filter((item: any) => rightCollection.includes(item)).length;
}

export default SimilarityScoreService;