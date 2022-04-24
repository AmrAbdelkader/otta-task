import CSVParser from './parser/csv-parser';


describe("jobs file parsing", () => {
    test("it should parse jobs file", async () => {
      
        const parser = new CSVParser();
      
        const mockedJobs = [
            {'job_id': "9975", 'company_id': "23"}
        ]

        const jobs = await parser.parseJobs();
        console.log(jobs);


        expect(jobs[0]).toEqual(mockedJobs[0]);
    });
  });