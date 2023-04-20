import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const createJob = (req: Request, res: Response) => {
  res.status(StatusCodes.CREATED).json({ msg: 'Job created' });
};

const getAllJobs = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ msg: 'Success' });
};

const getJob = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ msg: 'Success' });
};

const updateJob = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ msg: 'Job updated' });
};

const deleteAllJobs = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ msg: 'All jobs deleted' });
};

const deleteJob = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ msg: 'Job deleted' });
};

export { createJob, getAllJobs, getJob, updateJob, deleteAllJobs, deleteJob };
