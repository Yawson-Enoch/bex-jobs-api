import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
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

// eslint-disable-next-line func-names
userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(Number(process.env.PSWD_SALT));
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
