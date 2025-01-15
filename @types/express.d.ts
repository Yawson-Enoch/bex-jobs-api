import { UserAttachedToReqObject } from '../src/middleware/auth.middleware';

declare global {
  namespace Express {
    export interface Request {
      user: UserAttachedToReqObject;
    }
  }
}
