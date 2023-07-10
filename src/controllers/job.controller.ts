/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors';
import Job from '../models/job.model';
import type { Job as TJob, JobParams } from '../schemas/job.schema';

const createJob = async (
  req: Request<unknown, unknown, TJob>,
  res: Response
) => {
  await Job.create({ ...req.body, createdBy: req.user._id });

  res.status(StatusCodes.CREATED).json({ msg: 'Job created' });
};

const getJobs = async (req: Request, res: Response) => {
  const { sort, search, status, type } = req.query;

  const queryObject: Record<string, any> = {
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
    result = result.sort('company jobLocation jobPosition');
  }
  if (sort === 'z-a') {
    result = result.sort('-company -jobLocation -jobPosition');
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalNumberOfJobs = await Job.countDocuments(queryObject);
  const totalNumberOfPages = Math.ceil(totalNumberOfJobs / limit);
  const nextPage = page * limit < totalNumberOfJobs ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  const paginatedData = {
    totalNumberOfJobs,
    currentPageJobs: jobs,
    totalNumberOfJobsOnCurrPage: jobs.length,
    resultsPerPage: limit,
    totalNumberOfPages,
    currentPageNumber: page,
    prevPageNumber: prevPage,
    nextPageNumber: nextPage,
  };

  res.status(200).json({
    msg: 'Success',
    paginatedData,
  });
};

const getJob = async (req: Request<JobParams>, res: Response) => {
  const job = await Job.findOne({
    createdBy: req.user._id,
    _id: req.params.jobID,
  });

  if (!job) throw new NotFoundError(`No job with id: ${req.params.jobID}`);

  res.status(StatusCodes.OK).json({ msg: 'Success', job });
};

const updateJob = async (
  req: Request<JobParams, unknown, TJob>,
  res: Response
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
  const stats = await Job.aggregate([
    { $match: { createdBy: req.user._id } },
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
  ]);

  const statsTransformed = stats.reduce((acc, curr) => {
    const { _id: status, count } = curr;
    acc[status] = count;
    return acc;
  }, {});

  const statsWithDefaults = {
    pending: statsTransformed.pending || 0,
    interview: statsTransformed.interview || 0,
    declined: statsTransformed.declined || 0,
  };

  const monthlyApplications = await Job.aggregate([
    { $match: { createdBy: req.user._id } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const monthlyApplicationsFormatted = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const formattedDate = formatter.format(
        new Date(year as number, month - 1)
      );

      return { date: formattedDate, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({
    msg: 'Success',
    statusStats: statsWithDefaults,
    monthlyApplications: monthlyApplicationsFormatted,
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
