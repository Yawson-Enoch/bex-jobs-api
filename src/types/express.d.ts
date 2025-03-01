import type { AuthUser } from './auth-user';

declare global {
  namespace Express {
    export interface Request {
      user: AuthUser;
    }
  }
}
