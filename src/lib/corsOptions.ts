import { CorsOptions } from 'cors';
import { ForbiddenError } from '../errors';

const allowedOrigins = ['http://localhost:3000'];
const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new ForbiddenError('Not allowed by CORS!'), false);
    }
  },
};

export default corsOptions;
