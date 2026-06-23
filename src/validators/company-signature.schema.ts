import { z } from 'zod';

export const companySignatureSchema = z.object({
  companyId: z.number().int().positive(),
  orderNo: z.coerce.number().int().min(0),
  fullName: z.string().min(1, 'Full name is required'),
  position: z.string().min(1, 'Position is required'),
  isActive: z.boolean(),
});

export type CompanySignatureFormData = z.infer<typeof companySignatureSchema>;
