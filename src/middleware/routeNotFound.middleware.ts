import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const routeNotFoundMiddleware = (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: 'Route not found' });
};

export default routeNotFoundMiddleware;
