import { z } from 'zod';

export const employeeEducationSchema = z.object({
  companyId: z.number().int().positive(),
  employeeId: z.number().int().positive(),
  organizationCode: z.string().min(1, 'Organization code is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  educationLevelLookupValueId: z.coerce.number().int().min(0),
  eduDocTypeLookupValueId: z.coerce.number().int().min(0),
  documentNumber: z.string(),
  profession: z.string(),
});

export type EmployeeEducationFormData = z.infer<typeof employeeEducationSchema>;
