import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import env from '../env';
import { NotFoundError, UnauthenticatedError } from '../errors';
import User from '../models/user.model';
import type { Login, Register, UpdateProfile } from '../schemas/auth.schema';

const register = async (
  req: Request<unknown, unknown, Register>,
  res: Response,
) => {
  await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: 'User created successfully' });
};

const login = async (req: Request<unknown, unknown, Login>, res: Response) => {
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
    },
  );

  res.status(StatusCodes.OK).json({
    msg: 'Login successful',
    data: {
      token,
    },
  });
};

const getUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) throw new NotFoundError('No user found');

  res.status(StatusCodes.OK).json({ msg: 'Success', data: user });
};

const updateUser = async (
  req: Request<unknown, unknown, UpdateProfile>,
  res: Response,
) => {
  const filter = {
    _id: req.user._id,
  };

  const update = req.body;

  const options = {
    new: true,
    runValidators: true,
  };

  const user = await User.findByIdAndUpdate(filter, update, options);

  if (!user) throw new NotFoundError('No user found');

  res.status(StatusCodes.OK).json({ msg: 'User updated' });
};

export { register, login, getUser, updateUser };
