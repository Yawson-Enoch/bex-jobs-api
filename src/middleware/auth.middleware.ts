import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import env from '../env';
import { UnauthenticatedError } from '../errors';

export interface ICustomRequest extends Request {
  user: {
    userId: Types.ObjectId;
    username: string;
  };
}

type TypeTokenInfo = jwt.JwtPayload & ICustomRequest['user'];

const authMiddleware = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Not authorized to access this route');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, env.JWT_SECRET_KEY) as TypeTokenInfo;
    req.user = { userId: decodedToken.userId, username: decodedToken.username };
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route');
  }
  next();
};

export default authMiddleware;
