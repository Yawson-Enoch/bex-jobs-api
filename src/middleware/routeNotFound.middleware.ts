import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import path from 'path';

const routeNotFoundMiddleware = (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND);

  if (req.accepts('html')) {
    return res.sendFile(path.resolve(__dirname, '..', 'public', '404.html'));
  }

  if (req.accepts('json')) {
    return res.json({ msg: 'Route not found' });
  }

  return res.type('txt').send('Route not found');
};

export default routeNotFoundMiddleware;
