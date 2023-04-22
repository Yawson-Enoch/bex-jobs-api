import { model, Schema, Model, Types } from 'mongoose';

interface IJob {
  company: string;
  position: string;
  status?: 'interview' | 'declined' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  createdBy: Types.ObjectId;
}

type TypeJobModel = Model<IJob, Record<string, never>>;

const jobSchema = new Schema<IJob, TypeJobModel>(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxLength: 200,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  {
    timestamps: true,
  }
);

const Job = model<IJob, TypeJobModel>('Job', jobSchema);
export default Job;
