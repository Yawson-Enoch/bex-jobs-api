import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors';
import Job from '../models/job.model';
import type { JobParams, Job as TJob } from '../schemas/job.schema';

const createJob = async (
  req: Request<unknown, unknown, TJob>,
  res: Response,
) => {
  await Job.create({ ...req.body, createdBy: req.user._id });

  res.status(StatusCodes.CREATED).json({ msg: 'Job created' });
};

const getJobs = async (req: Request, res: Response) => {
  const { sort, search, status, type } = req.query;

  const queryObject: Record<string, unknown> = {
    createdBy: req.user._id,
  };

  if (status && status !== 'all') {
    queryObject.jobStatus = status;
  }
  if (type && type !== 'all') {
    queryObject.jobType = type;
  }
  if (search) {
    queryObject.$or = [
      { company: { $regex: search, $options: 'i' } },
      { jobLocation: { $regex: search, $options: 'i' } },
      { jobPosition: { $regex: search, $options: 'i' } },
      { jobType: { $regex: search, $options: 'i' } },
      { jobStatus: { $regex: search, $options: 'i' } },
    ];
  }

  let result = Job.find(queryObject);

  if (sort === 'latest') {
    result = result.sort('-createdAt -updatedAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt updatedAt');
  }
  if (sort === 'a-z') {
    result = result.sort('jobPosition company jobLocation');
  }
  if (sort === 'z-a') {
    result = result.sort('-jobPosition -company -jobLocation');
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const jobs = await result;

  /* based on query */
  const totalNumberOfJobsBasedOnQuery = await Job.countDocuments(queryObject);
  const totalNumberOfPagesBasedOnQuery = Math.ceil(
    totalNumberOfJobsBasedOnQuery / limit,
  );
  const nextPage =
    page * limit < totalNumberOfPagesBasedOnQuery ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  res.status(200).json({
    msg: 'Success',
    data: jobs,
    pagination: {
      totalJobs: totalNumberOfJobsBasedOnQuery,
      totalPages: totalNumberOfPagesBasedOnQuery,
      perPage: limit,
      currentPage: page,
      nextPage: nextPage,
      prevPage: prevPage,
    },
  });
};

const getJob = async (req: Request<JobParams>, res: Response) => {
  const job = await Job.findOne({
    createdBy: req.user._id,
    _id: req.params.jobID,
  });

  if (!job) throw new NotFoundError(`No job with id: ${req.params.jobID}`);

  res.status(StatusCodes.OK).json({ msg: 'Success', data: job });
};

const updateJob = async (
  req: Request<JobParams, unknown, TJob>,
  res: Response,
) => {
  const filter = {
    createdBy: req.user._id,
    _id: req.params.jobID,
  };

  const update = req.body;

  const options = {
    new: true,
    runValidators: true,
  };

  const job = await Job.findOneAndUpdate(filter, update, options);

  if (!job) throw new NotFoundError(`No job with id: ${req.params.jobID}`);

  res.status(StatusCodes.OK).json({ msg: 'Job updated' });
};

const deleteJobs = async (req: Request, res: Response) => {
  await Job.deleteMany({ createdBy: req.user._id });

  res.status(StatusCodes.OK).json({ msg: 'All jobs deleted' });
};

const deleteJob = async (req: Request<JobParams>, res: Response) => {
  const job = await Job.findOneAndDelete({
    createdBy: req.user._id,
    _id: req.params.jobID,
  });

  if (!job) throw new NotFoundError(`No job with id: ${req.params.jobID}`);

  res.status(StatusCodes.OK).json({ msg: 'Job deleted' });
};

const showStats = async (req: Request, res: Response) => {
  const stats = (await Job.aggregate([
    { $match: { createdBy: req.user._id } },
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
  ])) as unknown as { _id: TJob['jobStatus']; count: number }[];

  const statsByJobStatus = stats.reduce(
    (acc, curr) => {
      const { _id: status, count } = curr;
      acc[status] = count;
      return acc;
    },
    {
      pending: 0,
      interview: 0,
      declined: 0,
    },
  );

  const monthlyApplications = (await Job.aggregate([
    { $match: { createdBy: req.user._id } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ])) as unknown as { _id: { year: number; month: number }; count: number }[];

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
