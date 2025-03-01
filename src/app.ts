import 'express-async-errors';

import path from 'path';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import env from './env';
import authMiddleware from './middleware/auth.middleware';
import errorMiddleware from './middleware/error.middleware';
import routeNotFoundMiddleware from './middleware/routeNotFound.middleware';
import authRoute from './routes/auth.route';
import jobRoute from './routes/job.route';
import rootRoute from './routes/root.route';
import statusRoute from './routes/status.route';

process.on('uncaughtException', (err) => {
  console.error({ errorName: err.name, errorMessage: err.message });
  console.error('UNCAUGHT EXCEPTION', '-', 'SHUTTING DOWN SERVER');
  process.exit(1);
});

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(helmet());
app.use(cors());

app.use('/', rootRoute);
app.use('/status', statusRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/jobs', authMiddleware, jobRoute);

app.use(routeNotFoundMiddleware);
app.use(errorMiddleware);

const server = app.listen(env.PORT, () => {
  const serverType = env.isProduction ? 'production' : 'dev';
  console.log(`Server (${serverType}) running on port (${env.PORT})`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error({ errorName: err.name, errorMessage: err.message });
  console.error('UNHANDLED REJECTION', '-', 'SHUTTING DOWN SERVER');
  server.close(() => process.exit(1));
});
