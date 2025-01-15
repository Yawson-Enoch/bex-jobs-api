import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const routeNotFoundMiddleware = (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(StatusCodes.NOT_FOUND);
  res.json({ msg: 'Route not found' });

  next();
};

export default routeNotFoundMiddleware;
