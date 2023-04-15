/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { capitalizeFirstLetterOfWord } from '../lib/util';

const errorMiddleware: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };

  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    customError.msg = message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.code && err.code === 11000) {
    const message = `Duplicate field value: ${err.keyValue.name}. Please use another value`;
    customError.msg = message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(err.errors).map(
      (validationError: any) => validationError.message
    );
    const message = `Invalid input data. ${validationErrors.join('. ')}`;
    customError.msg = message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === 'ZodError') {
    const validationErrors = err.issues.map(
      (issue: any) =>
        `${capitalizeFirstLetterOfWord(
          issue.path[1]
        )}: ${issue.message.toLowerCase()}`
    );
    const message = `${validationErrors.join('. ')}`;
    customError.msg = message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (process.env.NODE_ENV === 'production') {
    return res.status(customError.statusCode).json({ msg: customError.msg });
  }
  return res.status(customError.statusCode).json({
    name: err.name,
    msg: customError.msg,
    error: err,
    stack: err.stack,
  });
};
export default errorMiddleware;
