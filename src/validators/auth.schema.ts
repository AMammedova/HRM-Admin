import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, 'auth.emailRequired').email('auth.emailInvalid'),
  password: z.string().min(6, 'auth.passwordMin'),
});

export type SignInFormData = z.infer<typeof signInSchema>;

