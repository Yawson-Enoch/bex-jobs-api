import { z } from 'zod';

const bodySchema = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(2, { message: 'Name must be 2 or more characters long' }),
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .email({ message: 'Invalid email address' }),
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
      })
      .min(6, { message: 'Password must be 6 or more characters long' }),
    passwordConfirm: z.string({
      required_error: 'Password confirmation value is required',
      invalid_type_error: 'Password confirmation value must be a string',
    }),
  })
  .strict();

const registerSchema = z.object({
  body: bodySchema.refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  }),
});
type TypeRegister = z.infer<typeof registerSchema>['body'];

const loginSchema = z.object({
  body: bodySchema.omit({ name: true, passwordConfirm: true }),
});
type TypeLogin = z.infer<typeof loginSchema>['body'];

export { registerSchema, loginSchema, TypeRegister, TypeLogin };
