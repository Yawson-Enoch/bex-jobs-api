import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors';
import User from '../models/user.model';
import { TypeLogin, TypeRegister } from '../schemas/auth.schema';

const register = async (
  req: Request<unknown, unknown, TypeRegister>,
  res: Response
) => {
  await User.create(req.body);
  res.status(StatusCodes.OK).json({ msg: 'User created successfully' });
};

const login = async (
  req: Request<unknown, unknown, TypeLogin>,
  res: Response
) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) throw new BadRequestError('Email is incorrect');

  const isAMatchingPassword = await user.comparePassword(req.body.password);
  if (!isAMatchingPassword) throw new BadRequestError('Password is incorrect');

  res.status(StatusCodes.OK).json({ msg: 'Login successful', data: user });
};

export { login, register };
