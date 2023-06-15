import { Router } from 'express';
import {
  getUser,
  login,
  register,
  updateUser,
} from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';
import requestValidatorMiddleware from '../middleware/requestValidator.middleware';
import {
  loginSchema,
  profileSchema,
  registerSchema,
} from '../schemas/auth.schema';

const router = Router();

router.post(
  '/register',
  requestValidatorMiddleware({
    body: registerSchema,
  }),
  register
);

router.post(
  '/login',
  requestValidatorMiddleware({
    body: loginSchema,
  }),
  login
);

router.get('/get-user', authMiddleware, getUser);

router.patch(
  '/update-user',
  [
    authMiddleware,
    requestValidatorMiddleware({
      body: profileSchema,
    }),
  ],
  updateUser
);

export default router;
