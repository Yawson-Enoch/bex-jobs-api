import mongoose from 'mongoose';

const connectDb = (uri: string) => mongoose.connect(uri);

export default connectDb;
