import path from 'path';
import { Router, type Request, type Response } from 'express';

const router = Router();

router.get('/', (_: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

export default router;
