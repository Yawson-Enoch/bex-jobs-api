import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import env from '../env';
import { UnauthenticatedError } from '../errors';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
}

type TypeTokenInfo = jwt.JwtPayload & IUser;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication error');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, env.JWT_SECRET_KEY) as TypeTokenInfo;
    req.user = {
      _id: decodedToken._id,
      username: decodedToken.username,
      email: decodedToken.email,
    };
  } catch (error) {
    throw new UnauthenticatedError('Authentication error');
  }
  next();
};

export default authMiddleware;
