import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import requestValidatorMiddleware from '../middleware/requestValidator.middleware';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

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

export default router;
