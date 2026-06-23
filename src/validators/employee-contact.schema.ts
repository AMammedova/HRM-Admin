import { z } from 'zod';

export const employeeContactSchema = z.object({
  companyId: z.number().int().positive(),
  employeeId: z.number().int().positive(),
  email1: z.string(),
  email2: z.string(),
  phone1: z.string(),
  phone2: z.string(),
  phone3: z.string(),
  phone4: z.string(),
  postIndex: z.string(),
  regAddress: z.string(),
  regAddress2: z.string(),
  liveAddress: z.string(),
  liveAddress2: z.string(),
});

export type EmployeeContactFormData = z.infer<typeof employeeContactSchema>;
