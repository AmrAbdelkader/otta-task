const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

class CSVParser {

    

    parseJobs(): Promise<any> {

        const dirPath: any = path.join(__dirname, '/data');

        return new Promise(function (resolve, reject) {
            try{
                const jobsData: Array<any> = [];
                fs.createReadStream(process.cwd() + '/src/data/jobs.csv')
                .pipe(csv())
                .on('data', (data: Array<any>) => jobsData.push(data))
                .on('end', () => resolve(jobsData));
            }catch(err){
                reject(err);
            }
        });
    }

}

export default CSVParser;