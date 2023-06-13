import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import env from '../env';
import { UnauthenticatedError } from '../errors';
import User, { type TUser } from '../models/user.model';

export type UserAttachedToReqObject = Omit<TUser, 'password'> & {
  _id: Types.ObjectId;
};

type TypeTokenInfo = jwt.JwtPayload & UserAttachedToReqObject;

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

    const user = await User.findById<UserAttachedToReqObject>(
      decodedToken._id
    ).select('firstName lastName email');

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
