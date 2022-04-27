import { Reaction } from "../models/reaction";
import SimilarityScoreService from "./similarity-score.service";


describe('similarity score service tests', () => {

    test('join reactions & jobs csv files', async () => {

        const expectedJoinedData: Array<Reaction> = [
            { user_id: 5193, job_id: 3367, company_id:114, direction: true, time: '2019-08-23 08:32:39'}, 
            { user_id: 7038, job_id: 4554, company_id:124, direction: true, time: '2019-08-29 16:54:31'}, 
            { user_id: 2439, job_id: 2831, company_id:9, direction: false, time: '2019-08-14 11:55:30'}, 
            { user_id: 1791, job_id: 6031, company_id:243, direction: true, time: '2019-08-13 09:12:54'}, 
        ];

        const simScoreService = new SimilarityScoreService();
        const joinedData = await simScoreService.mergeReactionsAndJobs();

        expect(joinedData[0]).toEqual(expectedJoinedData[0]);

    });

    test('get highest companies similarity score', async () => {

        const simScoreService = new SimilarityScoreService();
        const simScore = await simScoreService.getHighestCompaniesSimilarityScore();

        expect(simScore).toBeTruthy();
        expect(simScore.score).toBeGreaterThan(0);
    });

    test('get highest users similarity score', async () => {

        const simScoreService = new SimilarityScoreService();
        const simScore = await simScoreService.getHighestUsersSimilarityScore();

        expect(simScore).toBeTruthy();
        expect(simScore.score).toBeGreaterThan(0);
    });

})