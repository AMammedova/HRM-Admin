import { z } from 'zod';

const translationSchema = z.object({
  languageCode: z.enum(['az', 'en', 'ru']),
  name: z.string().min(1, 'Name is required'),
});

export const orgChartLineSchema = z.object({
  companyId: z.number().int().positive(),
  code: z.string().min(1, 'Code is required'),
  isVisible: z.boolean(),
  translations: z.array(translationSchema).length(3),
});

export type OrgChartLineFormData = z.infer<typeof orgChartLineSchema>;

export const defaultOrgChartLineTranslations = (): OrgChartLineFormData['translations'] => [
  { languageCode: 'az', name: '' },
  { languageCode: 'en', name: '' },
  { languageCode: 'ru', name: '' },
];
