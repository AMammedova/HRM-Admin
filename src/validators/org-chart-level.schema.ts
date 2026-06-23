import { z } from 'zod';

const translationSchema = z.object({
  languageCode: z.enum(['az', 'en', 'ru']),
  name: z.string().min(1, 'Name is required'),
});

export const orgChartLevelSchema = z.object({
  companyId: z.number().int().positive(),
  orgChartLineId: z.number().int().positive({ message: 'Org chart line is required' }),
  parentId: z.number().int().positive().nullable().optional(),
  code: z.string().min(1, 'Code is required'),
  isVisible: z.boolean(),
  translations: z.array(translationSchema).length(3),
});

export type OrgChartLevelFormData = z.infer<typeof orgChartLevelSchema>;

export const defaultOrgChartLevelTranslations = (): OrgChartLevelFormData['translations'] => [
  { languageCode: 'az', name: '' },
  { languageCode: 'en', name: '' },
  { languageCode: 'ru', name: '' },
];
