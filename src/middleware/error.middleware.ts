import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';
import env from '../env';
import { CustomAPIError } from '../errors';
import { capitalizeFirstLetterOfWord } from '../lib/util';

interface AppError extends CustomAPIError {
  code?: number;
  keyValue?: Record<string, unknown>;
}

const errorMiddleware = (
  err: AppError,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  const customError = {
    statusCode:
      err instanceof CustomAPIError
        ? err.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR,
    msg:
      err instanceof CustomAPIError
        ? err.message
        : 'Something went wrong, try again later',
  };
  /* invalid mongoDB id */
  if (err instanceof MongooseError.CastError) {
    const message = `Invalid ${err.path}: ${err.value}`;
    customError.msg = message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  /* duplicate unique key error 
  - eg: user signing up with same email as another user
  */
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const errTexts: string[] = Object.keys(err.keyValue as object);
    const validationError = errTexts.map((text: string) => text)[0] as string;
    const message = `${capitalizeFirstLetterOfWord(
      validationError,
    )} already exists, please use another ${validationError}`;
    customError.msg = message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  /* missing required fields - here to catch ones just incase zod fails */
  if (err instanceof MongooseError.ValidationError) {
    const validationErrors = Object.values(err.errors).map(
      (validationError) => validationError.message,
    );
    const message = `Invalid input data. ${validationErrors.join('. ')}`;
    customError.msg = message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  /* zod errors */
  if (err instanceof ZodError) {
    const validationErrors = err.issues.map((issue) => {
      if (issue.code === 'invalid_enum_value') {
        const options = issue.options.join(', ');
        const message =
          `The accepted values for ${issue.path[0]} are ${options}`.toLowerCase();
        return `${capitalizeFirstLetterOfWord(message)}`;
      }

      return `${capitalizeFirstLetterOfWord(issue.message.toLowerCase())}`;
    });
    const message = validationErrors.join('. ');
    customError.msg = message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (env.isProduction) {
    res.status(customError.statusCode).json({ msg: customError.msg });
  } else {
    res.status(customError.statusCode).json({
      name: err.name,
      msg: customError.msg,
      error: err,
      stack: err.stack,
    });
  }

  next();
};
export default errorMiddleware;
