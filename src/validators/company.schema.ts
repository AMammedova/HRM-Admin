import { z } from 'zod';

const translationSchema = z.object({
  languageCode: z.enum(['az', 'en', 'ru']),
  name: z.string().min(1, 'Name is required'),
  factAddress: z.string().min(1, 'Fact address is required'),
  legalAddress: z.string().min(1, 'Legal address is required'),
});

export const companySchema = z.object({
  compCode: z.string().min(1, 'Company code is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  email: z.string().email('Invalid email address'),
  companyTypeId: z.coerce.number().int().positive('Company type is required'),
  businessTravelSettingId: z
    .union([z.coerce.number().int().positive(), z.nan(), z.literal('')])
    .optional()
    .transform((val) => (val === '' || val === undefined || Number.isNaN(val as number) ? null : val)),
  overtimeSettingId: z
    .union([z.coerce.number().int().positive(), z.nan(), z.literal('')])
    .optional()
    .transform((val) => (val === '' || val === undefined || Number.isNaN(val as number) ? null : val)),
  timesheetPeriodTypeId: z.coerce.number().int().positive('Timesheet period type is required'),
  translations: z.array(translationSchema).length(3),
});

export type CompanyFormData = z.infer<typeof companySchema>;

export const defaultTranslations = (): CompanyFormData['translations'] => [
  { languageCode: 'az', name: '', factAddress: '', legalAddress: '' },
  { languageCode: 'en', name: '', factAddress: '', legalAddress: '' },
  { languageCode: 'ru', name: '', factAddress: '', legalAddress: '' },
];
