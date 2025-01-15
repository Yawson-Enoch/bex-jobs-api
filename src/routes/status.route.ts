import { Router, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.get('/', (_: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ msg: 'Server is active' });
});

export default router;
