import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import env from '@/env';
import type { AuthUser } from '@/types/auth-user';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(env.PSWD_SALT);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  incomingPassword: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(incomingPassword, hashedPassword);
};

export const jwtSign = ({ id, email }: AuthUser) => {
  const token = jwt.sign(
    {
      id,
      email,
    },
    env.JWT_SECRET_KEY,
    {
      expiresIn: env.JWT_EXPIRY_DATE,
    },
  );

  return token;
};
