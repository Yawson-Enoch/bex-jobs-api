import type { NextFunction, Request, Response } from 'express';

import { ForbiddenError } from '@/errors';

const testUserMiddleware = (req: Request, _: Response, next: NextFunction) => {
  const isTestUser = req.user.id === '64b42af1b57a900bcb39a601';

  if (isTestUser) {
    throw new ForbiddenError('Um! Read-only for test users');
  }

  next();
};

export default testUserMiddleware;
