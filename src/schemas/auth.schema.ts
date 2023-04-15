import { z } from 'zod';

const bodySchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(2, { message: 'Name must be 2 or more characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be 6 or more characters long' }),
});

const registerSchema = z.object({
  body: bodySchema,
});
type TypeRegister = z.infer<typeof registerSchema>['body'];

const loginSchema = z.object({
  body: bodySchema.omit({ name: true }),
});
type TypeLogin = z.infer<typeof loginSchema>['body'];

export { registerSchema, loginSchema, TypeRegister, TypeLogin };
