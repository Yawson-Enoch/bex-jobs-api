import { UserAttachedToReqObject } from '../middleware/auth.middleware';

declare global {
  namespace Express {
    export interface Request {
      user: UserAttachedToReqObject;
    }
  }
}
