import 'express-async-errors';
import express from 'express';
import path from 'path';
import env from './env';
import authRoute from './routes/auth.route';
import rootRoute from './routes/root.route';
import errorMiddleware from './middleware/error.middleware';
import routeNotFoundMiddleware from './middleware/routeNotFound.middleware';
import connectDb from './lib/connectDb';

process.on('uncaughtException', (err) => {
  console.error({ errorName: err.name, errorMessage: err.message });
  console.error('UNCAUGHT EXCEPTION', '-', 'SHUTTING DOWN SERVER');
  process.exit(1);
});

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/', rootRoute);
app.use('/api/v1/auth', authRoute);

app.use(routeNotFoundMiddleware);
app.use(errorMiddleware);

connectDb(env.MONGO_URI)
  .then(() => console.log('Db connected successfully'))
  .catch((err: Error) =>
    console.error({ errorName: err.name, errorMessage: err.message })
  );

const server = app.listen(env.PORT, () => {
  const serverType = env.isProduction ? 'production' : 'dev';
  console.log(`Server (${serverType}) running on port ${env.PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error({ errorName: err.name, errorMessage: err.message });
  console.error('UNHANDLED REJECTION', '-', 'SHUTTING DOWN SERVER');
  server.close(() => process.exit(1));
});
