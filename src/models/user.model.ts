import { Model, Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../env';

interface IUser {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(userPassword: string): Promise<boolean>;
}

type TypeUserModel = Model<IUser, Record<string, never>>;

const userSchema = new Schema<IUser, TypeUserModel>(
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
      select: false,
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

const User = model<IUser, TypeUserModel>('User', userSchema);

export default User;
