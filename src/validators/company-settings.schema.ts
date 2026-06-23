import { z } from 'zod';

export const companySettingsSchema = z.object({
  companyId: z.number().int().positive(),
  isManualOvertimeEnabled: z.boolean(),
  isAutoEmployeeCodeEnabled: z.boolean(),
  employeeCodeSymbolSize: z.coerce.number().int().min(1).max(20),
  isTimesheetExternalFileEnabled: z.boolean(),
  isServiceChargeEnabled: z.boolean(),
  isVacationAutoProlongEnabled: z.boolean(),
  isVacationIndexEnabled: z.boolean(),
  isWorkingTimeEnabled: z.boolean(),
});

export type CompanySettingsFormData = z.infer<typeof companySettingsSchema>;
