import { z } from 'zod';

const authSchema = z.object({
  firstName: z
    .string({
      required_error: 'First name is required',
      invalid_type_error: 'First name must be a string',
    })
    .trim()
    .min(2, { message: 'First name must be 2 or more characters long' }),
  lastName: z
    .string({
      required_error: 'Last name is required',
      invalid_type_error: 'Last name must be a string',
    })
    .trim()
    .min(2, { message: 'Last name must be 2 or more characters long' }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .trim()
    .email({ message: 'Invalid email address' }),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .trim()
    .min(8, { message: 'Password must be 8 or more characters long' }),
  passwordConfirm: z
    .string({
      required_error: 'Password confirmation value is required',
      invalid_type_error: 'Password confirmation value must be a string',
    })
    .trim(),
});

const registerSchema = authSchema.refine(
  (data) => data.password === data.passwordConfirm,
  {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  }
);
type Register = z.infer<typeof registerSchema>;

const loginSchema = authSchema.omit({
  firstName: true,
  lastName: true,
  passwordConfirm: true,
});
type Login = z.infer<typeof loginSchema>;

const profileSchema = authSchema.omit({
  password: true,
  passwordConfirm: true,
});
type Profile = z.infer<typeof profileSchema>;

const updateProfileSchema = profileSchema.partial();
type UpdateProfile = z.infer<typeof updateProfileSchema>;
export {
  registerSchema,
  Register,
  loginSchema,
  Login,
  profileSchema,
  Profile,
  updateProfileSchema,
  UpdateProfile,
};
