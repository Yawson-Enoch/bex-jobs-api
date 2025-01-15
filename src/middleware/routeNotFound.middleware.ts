import path from 'path';
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const routeNotFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(StatusCodes.NOT_FOUND);

  if (req.accepts('json')) {
    return res.json({ msg: 'Route not found' });
  }

  if (req.accepts('html')) {
    return res.sendFile(path.resolve(__dirname, '..', 'public', '404.html'));
  }

  res.type('txt').send('Route not found');
  next();
};

export default routeNotFoundMiddleware;
