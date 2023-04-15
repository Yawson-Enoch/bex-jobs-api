import 'express-async-errors';
import * as dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import authRoute from './routes/auth.route';
import rootRoute from './routes/root.route';
import errorMiddleware from './middleware/error.middleware';
import routeNotFoundMiddleware from './middleware/routeNotFound.middleware';
import connectDb from './lib/connectDb';

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/', rootRoute);
app.use('/api/v1/auth', authRoute);

app.use(routeNotFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;
connectDb(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () =>
      console.log(`Db connected and server is listening on port ${port}...`)
    );
  })
  .catch((err: Error) =>
    console.error({ errorName: err.name, errorMessage: err.message })
  );
