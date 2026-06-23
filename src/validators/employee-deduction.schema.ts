import { z } from 'zod';

export const employeeDeductionSchema = z.object({
  companyId: z.number().int().positive(),
  employeeId: z.number().int().positive(),
  deductionType: z.string().min(1, 'Deduction type is required'),
  documentNumber: z.string(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isPercentage: z.boolean(),
  amount: z.coerce.number(),
  totalAmount: z.coerce.number(),
  description: z.string(),
  isActive: z.boolean(),
  isPaid: z.boolean(),
  fileId: z.coerce.number().int().min(0),
});

export type EmployeeDeductionFormData = z.infer<typeof employeeDeductionSchema>;
