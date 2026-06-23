import { z } from 'zod';

const translationSchema = z.object({
  languageCode: z.enum(['az', 'en', 'ru']),
  name: z.string().min(1, 'Name is required'),
});

export const companyTypeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  sortOrder: z.coerce.number().int().min(0).optional(),
  translations: z.array(translationSchema).length(3),
});

export type CompanyTypeFormData = z.infer<typeof companyTypeSchema>;

export const defaultCompanyTypeTranslations = (): CompanyTypeFormData['translations'] => [
  { languageCode: 'az', name: '' },
  { languageCode: 'en', name: '' },
  { languageCode: 'ru', name: '' },
];
