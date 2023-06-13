import { Model, Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../env';
import type { Register } from '../schemas/auth.schema';

export type TUser = Omit<Register, 'passwordConfirm'>;

type UserExtended = TUser & {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(userPassword: string): Promise<boolean>;
};

type UserModel = Model<UserExtended, Record<string, never>>;

const userSchema = new Schema<UserExtended, UserModel>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      minLength: [2, 'First name must be 2 or more characters long'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      minLength: [2, 'Last name must be 2 or more characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      minLength: [6, 'Password must be 6 or more characters long'],
      required: [true, 'Password is required'],
    },
  },
  {
    methods: {
      async comparePassword(userPassword: string) {
        const isAMatchingPassword = await bcrypt.compare(
          userPassword,
          this.password
        );
        return isAMatchingPassword;
      },
    },
    timestamps: true,
  }
);

// eslint-disable-next-line func-names
userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(env.PSWD_SALT);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = model<UserExtended, UserModel>('User', userSchema);
export default User;
