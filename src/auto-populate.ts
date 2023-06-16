import { readFile } from 'fs/promises';
import path from 'path';
import env from './env';
import connectDb from './lib/connectDb';
import Job from './models/job.model';

interface TJob {
  company: string;
  jobPosition: string;
  jobLocation: string;
  jobType: string;
  jobStatus: string;
  createdBy: string;
  createdAt: string;
}

const autoPopulate = async () => {
  try {
    await connectDb(env.MONGO_URI);

    const fileContent = await readFile(
      path.join(__dirname, '..', 'mock-data.json'),
      'utf8'
    );
    const jobs = JSON.parse(fileContent) as TJob[];

    await Job.deleteMany({});
    await Job.create(jobs);

    console.log('Data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
autoPopulate();
