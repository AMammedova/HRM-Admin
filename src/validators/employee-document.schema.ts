import { z } from 'zod';

export const employeeDocumentSchema = z.object({
  companyId: z.number().int().positive(),
  employeeId: z.number().int().positive(),
  documentCode: z.string().min(1, 'Document code is required'),
  hasBeenPresented: z.boolean(),
});

export type EmployeeDocumentFormData = z.infer<typeof employeeDocumentSchema>;
