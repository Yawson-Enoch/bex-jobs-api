/* eslint-disable func-names */
import { Model, Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../env';

interface IUser {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  comparePassword(userPassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, Record<string, never>, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: [true, 'Name is required'],
      minLength: [2, 'Name must be 2 or more characters long'],
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
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(env.PSWD_SALT);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (userPassword: string) {
  const user = this as IUser & IUserMethods;
  const isAMatchingPassword = await bcrypt.compare(userPassword, user.password);
  return isAMatchingPassword;
};

const User = model<IUser, UserModel>('User', userSchema);

export default User;
