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
  const jobs = await Job.find({ createdBy: req.user._id }).sort(
    '-updatedAt -createdAt'
  );

  res.status(StatusCodes.OK).json({ msg: 'Success', jobs });
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

export { createJob, getJobs, getJob, updateJob, deleteJobs, deleteJob };
