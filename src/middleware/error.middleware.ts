/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, CustomError } from '../errors';

const handleCastErrorDb = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new BadRequestError(message);
};

const handleDuplicateFieldsDb = (err: any) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value`;
  return new BadRequestError(message);
};

const handleValidationErrorDb = (err: any) => {
  const validationErrors = Object.values(err.errors).map(
    (validationError: any) => validationError.message
  );
  const message = `Invalid input data. ${validationErrors.join('. ')}`;
  return new BadRequestError(message);
};

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    msg: err.message || 'Something went wrong, try again later',
    name: err.name,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ msg: err.message });
  } else {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Something went wrong, try again later' });
  }
};

const ErrorMiddleware: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') {
      return sendErrorProd(handleCastErrorDb(err), res);
    }
    if (err.code === 11000) {
      return sendErrorProd(handleDuplicateFieldsDb(err), res);
    }
    if (err.name === 'ValidationError') {
      return sendErrorProd(handleValidationErrorDb(err), res);
    }
    return sendErrorProd(err, res);
  }
  return sendErrorDev(err, res);
};
export default ErrorMiddleware;
