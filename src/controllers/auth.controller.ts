import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { TypeLogin, TypeRegister } from '../schemas/auth.schema';

const register = (
  req: Request<unknown, unknown, TypeRegister>,
  res: Response
) => {
  res
    .status(StatusCodes.OK)
    .json({ msg: 'This is the incredible register route', data: req.body });
};

const login = (req: Request<unknown, unknown, TypeLogin>, res: Response) => {
  res
    .status(StatusCodes.OK)
    .json({ msg: 'This is the incredible login route', data: req.body });
};

export { login, register };
