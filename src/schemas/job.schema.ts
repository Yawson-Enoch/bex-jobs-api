import { z } from 'zod';

export const jobParamsSchema = z.object({
  id: z.string({
    required_error: 'Please provide route param',
    invalid_type_error: 'Param must be a string',
  }),
});

export type JobParams = z.infer<typeof jobParamsSchema>;

const STATUS_OPTIONS = ['pending', 'interview', 'declined'] as const;
const JOB_TYPES = ['full-time', 'part-time', 'remote', 'internship'] as const;

export const jobSchema = z.object({
  jobPosition: z
    .string({
      required_error: 'Position is required',
      invalid_type_error: 'Position must be a string',
    })
    .min(2, { message: 'Position must be 2 or more characters long' })
    .max(200, {
      message: 'Position cannot be more than 200 characters long',
    }),
  company: z
    .string({
      required_error: 'Company name is required',
      invalid_type_error: 'Company name must be a string',
    })
    .min(2, { message: 'Company name must be 2 or more characters long' })
    .max(100, {
      message: 'Company name cannot be more than 100 characters long',
    }),
  jobLocation: z
    .string({
      required_error: 'Location is required',
      invalid_type_error: 'Location must be a string',
    })
    .min(2, { message: 'Location name must be 2 or more characters long' })
    .max(100, {
      message: 'Location name cannot be more than 200 characters long',
    }),
  jobStatus: z.enum(STATUS_OPTIONS).default('pending'),
  jobType: z
    .enum(JOB_TYPES, {
      errorMap: () => ({ message: 'Job type is required' }),
    })
    .default('full-time'),
});

export type Job = z.infer<typeof jobSchema>;
