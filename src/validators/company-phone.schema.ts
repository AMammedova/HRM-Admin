import { z } from 'zod';

export const companyPhoneSchema = z.object({
  companyId: z.number().int().positive(),
  number: z.string().min(1, 'Phone number is required'),
  orderNo: z.coerce.number().int().min(0),
  isFax: z.boolean(),
  isActive: z.boolean(),
});

export type CompanyPhoneFormData = z.infer<typeof companyPhoneSchema>;
