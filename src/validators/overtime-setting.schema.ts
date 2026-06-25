import { z } from 'zod';

const translationSchema = z.object({
  languageCode: z.enum(['az', 'en', 'ru']),
  name: z.string().min(1, 'Name is required'),
});

export const overtimeSettingSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  translations: z.array(translationSchema).length(3),
});

export type OvertimeSettingFormData = z.infer<typeof overtimeSettingSchema>;

export const defaultOvertimeSettingTranslations =
  (): OvertimeSettingFormData['translations'] => [
    { languageCode: 'az', name: '' },
    { languageCode: 'en', name: '' },
    { languageCode: 'ru', name: '' },
  ];
