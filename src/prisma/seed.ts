import {
  randCity,
  randCompanyName,
  randJobTitle,
  randPastDate,
} from '@ngneat/falso';
import { PrismaClient } from '@prisma/client';

import { JOB_STATUS_OPTIONS, JOB_TYPES } from '@/lib/constants';

const prisma = new PrismaClient();

const createdById = '67c1fcada43caca9623987b8';

const main = async () => {
  const jobs = Array.from({ length: 70 }).map(() => ({
    company: randCompanyName(),
    jobPosition: randJobTitle(),
    jobLocation: randCity(),
    jobType: JOB_TYPES[Math.floor(Math.random() * JOB_TYPES.length)]!,
    jobStatus:
      JOB_STATUS_OPTIONS[
        Math.floor(Math.random() * JOB_STATUS_OPTIONS.length)
      ]!,
    createdBy: createdById,
    createdAt: randPastDate({ years: 2 }),
  }));

  await prisma.job.createMany({
    data: jobs,
  });

  console.log('Seed data added successfully!');
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
