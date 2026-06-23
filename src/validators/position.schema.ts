import { z } from 'zod';

const translationSchema = z.object({
  languageCode: z.enum(['az', 'en', 'ru']),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export const positionSchema = z.object({
  companyId: z.number().int().positive(),
  orgChartLevelId: z.number().int().positive().nullable().optional(),
  code: z.string().min(1, 'Code is required'),
  isActive: z.boolean(),
  isBlueCollar: z.boolean(),
  vacationNorm: z.number().int().min(0),
  isAccordWorkCondition: z.boolean(),
  accordWorkConditionDay: z.number().int().min(0),
  translations: z.array(translationSchema).length(3),
});

export type PositionFormData = z.infer<typeof positionSchema>;

export const defaultPositionTranslations = (): PositionFormData['translations'] => [
  { languageCode: 'az', name: '', description: '' },
  { languageCode: 'en', name: '', description: '' },
  { languageCode: 'ru', name: '', description: '' },
];
