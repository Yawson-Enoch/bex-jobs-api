import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

import env from '@/env';
import { CustomAPIError } from '@/errors';
import { capitalizeFirstLetterOfWord } from '@/lib/utils';

interface AppError extends CustomAPIError {
  code?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>;
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
  /* duplicate unique key error 
  - eg: user signing up with same email as another user
  */
  if (err.name === 'PrismaClientKnownRequestError' && err.code === 'P2002') {
    const fieldName = err.meta!.target.split('_').at(1);

    const message = `${capitalizeFirstLetterOfWord(
      fieldName,
    )} already exists, please use another ${fieldName}`;

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
