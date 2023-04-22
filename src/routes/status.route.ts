import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ msg: 'Server is active' });
});

export default router;
