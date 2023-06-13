import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import env from '../env';
import { UnauthenticatedError } from '../errors';
import User from '../models/user.model';
import type { Login, Register } from '../schemas/auth.schema';

export const register = async (
  req: Request<unknown, unknown, Register>,
  res: Response
) => {
  await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: 'User created successfully' });
};

export const login = async (
  req: Request<unknown, unknown, Login>,
  res: Response
) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) throw new UnauthenticatedError('Invalid credentials');

  const isAMatchingPassword = await user.comparePassword(req.body.password);
  if (!isAMatchingPassword)
    throw new UnauthenticatedError('Invalid credentials');

  const token = jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    env.JWT_SECRET_KEY,
    {
      expiresIn: env.JWT_EXPIRY_DATE,
    }
  );

  res.status(StatusCodes.OK).json({
    msg: 'Login successful',
    token,
  });
};
