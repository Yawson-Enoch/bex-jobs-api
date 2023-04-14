import 'express-async-errors';
import * as dotenv from 'dotenv';
import express from 'express';
import authRoute from './routes/auth.route';
import errorMiddleware from './middleware/error.middleware';
import routeNotFoundMiddleware from './middleware/routeNotFound.middleware';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRoute);

app.use(routeNotFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
