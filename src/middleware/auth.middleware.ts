import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import env from '@/env';
import { UnauthenticatedError } from '@/errors';
import prisma from '@/prisma/prisma-client';
import type { AuthUser } from '@/types/auth-user';

type TypeTokenInfo = jwt.JwtPayload & AuthUser;

const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthenticatedError('Missing Authorization header');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Invalid Authorization header format');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthenticatedError('Authentication error');
  }

  const decodedToken = jwt.verify(token, env.JWT_SECRET_KEY) as TypeTokenInfo;

  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken.id,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    throw new UnauthenticatedError('Authentication error');
  }

  req.user = user;

  next();
};

export default authMiddleware;
