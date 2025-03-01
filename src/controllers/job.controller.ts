import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotFoundError } from '@/errors';
import type { JOB_STATUS_OPTIONS } from '@/lib/constants';
import prisma from '@/prisma/prisma-client';
import type { JobParams, Job as TJob } from '@/schemas/job.schema';

const createJob = async (
  req: Request<unknown, unknown, TJob>,
  res: Response,
) => {
  await prisma.job.create({
    data: {
      ...req.body,
      createdBy: req.user.id,
    },
  });

  res.status(StatusCodes.CREATED).json({ msg: 'Job created' });
};

const getJobs = async (req: Request, res: Response) => {
  const { sort, search, status, type, page, limit } = req.query;

  /* query builder 
  - update object values based on query params
  - add: sort, search, status, type, ...
  */
  const filters: Record<string, unknown> = {
    createdBy: req.user.id,
  };

  if (status && status !== 'all') {
    filters.jobStatus = status;
  }

  if (type && type !== 'all') {
    filters.jobType = type;
  }

  if (search) {
    filters.OR = [
      { company: { contains: search, mode: 'insensitive' } },
      { jobLocation: { contains: search, mode: 'insensitive' } },
      { jobPosition: { contains: search, mode: 'insensitive' } },
    ];
  }

  let orderBy: Record<string, unknown>[] = [];

  switch (sort) {
    case 'latest':
      orderBy = [{ updatedAt: 'desc' }, { createdAt: 'desc' }];
      break;
    case 'oldest':
      orderBy = [{ updatedAt: 'asc' }, { createdAt: 'asc' }];
      break;
    case 'a-z':
      orderBy = [{ company: 'asc' }, { jobLocation: 'asc' }];
      break;
    case 'z-a':
      orderBy = [{ company: 'desc' }, { jobLocation: 'desc' }];
      break;
  }

  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  const result = await prisma.job.findMany({
    where: filters,
    skip,
    take: pageSize,
    orderBy,
  });

  const totalJobs = await prisma.job.count({
    where: filters,
  });

  const totalPages = Math.ceil(totalJobs / pageSize);

  const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
  const prevPage = pageNumber > 1 ? pageNumber - 1 : null;

  res.status(200).json({
    msg: 'Success',
    data: result,
    pagination: {
      totalJobs,
      totalPages,
      perPage: pageSize,
      currentPage: pageNumber,
      nextPage: nextPage,
      prevPage: prevPage,
    },
  });
};

const getJob = async (req: Request<JobParams>, res: Response) => {
  const job = await prisma.job.findFirst({
    where: {
      createdBy: req.user.id,
      id: req.params.jobID,
    },
  });

  if (!job) throw new NotFoundError(`No job with id: ${req.params.jobID}`);

  res.status(StatusCodes.OK).json({ msg: 'Success', data: job });
};

const updateJob = async (
  req: Request<JobParams, unknown, TJob>,
  res: Response,
) => {
  const job = await prisma.job.update({
    where: {
      createdBy: req.user.id,
      id: req.params.jobID,
    },
    data: req.body,
  });

  if (!job) throw new NotFoundError(`No job with id: ${req.params.jobID}`);

  res.status(StatusCodes.OK).json({ msg: 'Job updated' });
};

const deleteJobs = async (req: Request, res: Response) => {
  await prisma.job.deleteMany({
    where: {
      createdBy: req.user.id,
    },
  });

  res.status(StatusCodes.OK).json({ msg: 'All jobs deleted' });
};

const deleteJob = async (req: Request<JobParams>, res: Response) => {
  const job = await prisma.job.delete({
    where: { createdBy: req.user.id, id: req.params.jobID },
  });

  if (!job) throw new NotFoundError(`No job with id: ${req.params.jobID}`);

  res.status(StatusCodes.OK).json({ msg: 'Job deleted' });
};

const showStats = async (req: Request, res: Response) => {
  const stats = await prisma.job.groupBy({
    by: ['jobStatus'],
    where: {
      createdBy: req.user.id,
    },
    _count: {
      jobStatus: true,
    },
  });

  const statsByJobStatus = stats.reduce(
    (acc, curr) => {
      acc[curr.jobStatus as (typeof JOB_STATUS_OPTIONS)[number]] =
        curr._count.jobStatus;
      return acc;
    },
    {
      pending: 0,
      interview: 0,
      declined: 0,
    },
  );

  type MonthlyApplicationsAggregate = {
    _id: { year: number; month: number };
    count: number;
  }[];

  const monthlyApplications = (await prisma.job.aggregateRaw({
    pipeline: [
      { $match: { createdBy: { $oid: req.user.id } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ],
  })) as unknown as MonthlyApplicationsAggregate;

  const monthlyApplicationsFormatted = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric',
      });

      const date = formatter.format(new Date(year, month - 1));

      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({
    msg: 'Success',
    data: {
      jobStatusStats: statsByJobStatus,
      monthlyApplications: monthlyApplicationsFormatted,
    },
  });
};

export {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJobs,
  deleteJob,
  showStats,
};
