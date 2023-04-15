import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import userModel from '../models/user.model';
import { TypeLogin, TypeRegister } from '../schemas/auth.schema';

const register = async (
  req: Request<unknown, unknown, TypeRegister>,
  res: Response
) => {
  await userModel.create(req.body);
  res.status(StatusCodes.OK).json({ msg: 'User created successfully' });
};

const login = (req: Request<unknown, unknown, TypeLogin>, res: Response) => {
  res
    .status(StatusCodes.OK)
    .json({ msg: 'This is the incredible login route', data: req.body });
};

export { login, register };
