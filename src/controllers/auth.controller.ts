import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import env from '../env';
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

  const token = jwt.sign(
    { userId: user._id, username: user.name },
    env.JWT_SECRET_KEY,
    {
      expiresIn: env.JWT_EXPIRY_DATE,
    }
  );

  res.status(StatusCodes.OK).json({
    msg: 'Login successful',
    data: { token, userInfo: { userId: user._id, username: user.name } },
  });
};

export { login, register };
