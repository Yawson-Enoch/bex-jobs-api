import { cleanEnv, str, port, num } from 'envalid';
import * as dotenv from 'dotenv';

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
});

export default env;
