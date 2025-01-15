import * as dotenv from 'dotenv';
import { cleanEnv, num, port, str } from 'envalid';

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: port({
    default: 5000,
  }),
  NODE_ENV: str({
    choices: ['development', 'production'],
    default: 'development',
  }),
  MONGO_URI: str(),
  PSWD_SALT: num(),
  JWT_SECRET_KEY: str(),
  JWT_EXPIRY_DATE: str(),
});

export default env;
