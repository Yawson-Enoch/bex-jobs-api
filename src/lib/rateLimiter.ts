import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: { msg: 'Too many requests!' },
  statusCode: StatusCodes.TOO_MANY_REQUESTS, // just being a lil explicit
  headers: true, // just being a lil explicit
});

export default apiLimiter;
