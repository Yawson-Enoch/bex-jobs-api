import { model, Model, Schema, Types } from 'mongoose';
import type { Job as TJob } from '../schemas/job.schema';

type JobExtended = TJob & {
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

type JobModel = Model<JobExtended, Record<string, never>>;

const jobSchema = new Schema<JobExtended, JobModel>(
  {
    jobPosition: {
      type: String,
      required: [true, 'Please provide position'],
      minlength: 2,
      maxlength: 200,
    },
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      minlength: 2,
      maxlength: 100,
    },
    jobLocation: {
      type: String,
      required: [true, 'Please provide position'],
      minlength: 2,
      maxlength: 200,
    },
    jobStatus: {
      type: String,
      enum: ['pending', 'interview', 'declined'],
      default: 'pending',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  {
    timestamps: true,
  },
);

const Job = model<JobExtended, JobModel>('Job', jobSchema);
export default Job;
