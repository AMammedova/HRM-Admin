import { z } from 'zod';

export const userSchema = z.object({
  firstName: z.string().min(1, 'validation.required'),
  lastName: z.string().min(1, 'validation.required'),
  email: z.string().email('validation.invalid'),
  phone: z.string().optional(),
  role: z.string().min(1, 'validation.required'),
  department: z.string().min(1, 'validation.required'),
  position: z.string().min(1, 'validation.required'),
  status: z.enum(['active', 'inactive']),
});

export type UserFormData = z.infer<typeof userSchema>;

export const createUserSchema = userSchema;
export const updateUserSchema = userSchema.partial();

