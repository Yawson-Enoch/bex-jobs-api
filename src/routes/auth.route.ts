import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import schemaValidatorMiddleware from '../middleware/schemaValidator.middleware';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', schemaValidatorMiddleware(registerSchema), register);
router.post('/login', schemaValidatorMiddleware(loginSchema), login);

export default router;
