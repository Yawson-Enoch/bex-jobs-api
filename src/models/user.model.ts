import mongoose from 'mongoose';

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

export default mongoose.model('User', userSchema);
