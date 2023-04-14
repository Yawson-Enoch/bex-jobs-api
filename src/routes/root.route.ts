import { Router, Request, Response } from 'express';
import path from 'path';

const router = Router();

router.get(['/', '/index.html'], (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

export default router;
