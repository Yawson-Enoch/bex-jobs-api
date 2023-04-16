/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../errors';
import { capitalizeFirstLetterOfWord } from '../lib/util';

const errorMiddleware: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customError = {
    statusCode:
      err instanceof CustomError
        ? err.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR,
    msg:
      err instanceof CustomError
        ? err.message
        : 'Something went wrong, try again later',
  };

  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    customError.msg = message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const errTexts: string[] = Object.keys(err.keyValue as object);
    const validationError = errTexts.map((text: string) => text)[0];
    const message = `${capitalizeFirstLetterOfWord(
      validationError
    )} already exists, please use another ${validationError}`;
    customError.msg = message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(
      err.errors as { [s: string]: unknown } | ArrayLike<unknown>
    ).map((validationError: any) => validationError.message as string);
    const message = `Invalid input data. ${validationErrors.join('. ')}`;
    customError.msg = message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === 'ZodError') {
    const validationErrors = (err.issues as any[]).map(
      (issue: any) =>
        `${capitalizeFirstLetterOfWord(
          (issue.message as string).toLowerCase()
        )}`
    );
    const message = `Invalid input data. ${validationErrors.join('. ')}`;
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
