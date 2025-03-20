import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotFoundError, UnauthenticatedError } from '@/errors';
import { comparePassword, hashPassword, jwtSign } from '@/lib/auth';
import prisma from '@/prisma/prisma-client';
import type { Login, Register, UpdateProfile } from '@/schemas/auth.schema';

const register = async (
  req: Request<unknown, unknown, Register>,
  res: Response,
) => {
  const { passwordConfirm: _, password, ...userData } = req.body;

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) throw new UnauthenticatedError('Signup failed');

  const token = jwtSign({ ...user });

  res.status(StatusCodes.OK).json({
    msg: 'Signup successful',
    data: {
      token,
    },
  });
};

const login = async (req: Request<unknown, unknown, Login>, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (!user) throw new UnauthenticatedError('Invalid credentials');

  const isAMatchingPassword = await comparePassword(
    req.body.password,
    user.password,
  );
  if (!isAMatchingPassword)
    throw new UnauthenticatedError('Invalid credentials');

  const token = jwtSign({ ...user });

  res.status(StatusCodes.OK).json({
    msg: 'Login successful',
    data: {
      token,
    },
  });
};

const getUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    omit: {
      password: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw new NotFoundError('No user found');

  res.status(StatusCodes.OK).json({ msg: 'Success', data: user });
};

const updateUser = async (
  req: Request<unknown, unknown, UpdateProfile>,
  res: Response,
) => {
  const user = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: req.body,
  });

  if (!user) throw new NotFoundError('No user found');

  res.status(StatusCodes.OK).json({ msg: 'User updated' });
};

export { register, login, getUser, updateUser };
