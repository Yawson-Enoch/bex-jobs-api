import { IUser } from '../middleware/auth.middleware';

declare global {
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
}
