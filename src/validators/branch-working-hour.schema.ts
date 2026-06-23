import { z } from 'zod';

export const branchWorkingHourSchema = z.object({
  companyId: z.number().int().positive(),
  branchId: z.number().int().positive(),
  jobStartTime: z.string().min(1, 'Job start time is required'),
  jobEndTime: z.string().min(1, 'Job end time is required'),
  lunchStartTime: z.string().min(1, 'Lunch start time is required'),
  lunchEndTime: z.string().min(1, 'Lunch end time is required'),
  isActive: z.boolean(),
});

export type BranchWorkingHourFormData = z.infer<typeof branchWorkingHourSchema>;
