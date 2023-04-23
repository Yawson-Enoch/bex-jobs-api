import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import env from '../env';
import { UnauthenticatedError } from '../errors';
import User from '../models/user.model';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
}

type TypeTokenInfo = jwt.JwtPayload & IUser;

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthenticatedError('Missing Authorization header');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Invalid Authorization header format');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, env.JWT_SECRET_KEY) as TypeTokenInfo;

    const user = await User.findById<IUser>(decodedToken._id).select(
      'username email'
    );

    if (!user) {
      throw new UnauthenticatedError('Authentication error');
    }

    req.user = user;
  } catch (error) {
    throw new UnauthenticatedError('Authentication error');
  }
  next();
};

export default authMiddleware;
