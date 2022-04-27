import { Reaction } from '../models/reaction';
import CSVParser from './csv-parser';


describe("csv data file parsing", () => {
    
    const mockedReactions: Array<Reaction> = [
        {'user_id': 5193, 'job_id': 3367, 'direction': true, 'time': '2019-08-23 08:32:39'}, 
        {'user_id': 7038, 'job_id': 4554, 'direction': true, 'time': '2019-08-29 16:54:31'}, 
        {'user_id': 2439, 'job_id': 2831, 'direction': false, 'time': '2019-08-14 11:55:30'}, 
        {'user_id': 1791, 'job_id': 6031, 'direction': true, 'time': '2019-08-13 09:12:54'}, 
    ];

    test("it should parse reactions file", async () => {
        const parser = new CSVParser();
        const reactions = await parser.parseReactions();
        console.log(reactions);
        expect(reactions[0]).toEqual(mockedReactions[0]);
    });

    test("it should parse jobs file", async () => {
      
        const parser = new CSVParser();
      
        const mockedJobs = [
            {'job_id': 9975, 'company_id': 23}
        ]

        const jobs = await parser.parseJobs();
        console.log(jobs);


        expect(jobs[0]).toEqual(mockedJobs[0]);
    });
  });