import { model, Schema, Model, Types } from 'mongoose';
import { TypeJob } from '../schemas/job.schema';

type TypeJobExtended = TypeJob & {
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

type TypeJobModel = Model<TypeJobExtended, Record<string, never>>;

const jobSchema = new Schema<TypeJobExtended, TypeJobModel>(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      minlength: 2,
      maxlength: 100,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      minlength: 2,
      maxlength: 200,
    },
    status: {
      type: String,
      enum: ['pending', 'interview', 'declined'],
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

const Job = model<TypeJobExtended, TypeJobModel>('Job', jobSchema);
export default Job;
