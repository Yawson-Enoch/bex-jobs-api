import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string({
    required_error: 'Please provide route param',
    invalid_type_error: 'Param must be a string',
  }),
});

type TypeParams = z.infer<typeof paramsSchema>;

const createJobSchema = z.object({
  company: z
    .string({
      required_error: 'Company name is required',
      invalid_type_error: 'Company name must be a string',
    })
    .min(2, { message: 'Company name must be 2 or more characters long' })
    .max(100, {
      message: 'Company name cannot be more than 100 characters long',
    }),
  position: z
    .string({
      required_error: 'Position is required',
      invalid_type_error: 'Position must be a string',
    })
    .min(2, { message: 'Position must be 2 or more characters long' })
    .max(200, {
      message: 'Position cannot be more than 200 characters long',
    }),
  status: z.enum(['pending', 'interview', 'declined']).default('pending'),
});

type TypeJob = z.infer<typeof createJobSchema>;

const updateJobSchema = createJobSchema.partial({
  company: true,
  position: true,
});
type TypeJobPartial = z.infer<typeof updateJobSchema>;

export {
  TypeParams,
  TypeJob,
  TypeJobPartial,
  paramsSchema,
  createJobSchema,
  updateJobSchema,
};
