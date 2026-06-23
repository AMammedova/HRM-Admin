import { z } from 'zod';

const translationSchema = z.object({
  languageCode: z.enum(['az', 'en', 'ru']),
  name: z.string().min(1, 'Name is required'),
});

export const branchSchema = z.object({
  companyId: z.number().int().positive(),
  code: z.string().min(1, 'Code is required'),
  isActive: z.boolean(),
  isOffice: z.boolean(),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  address: z.string().optional(),
  region: z.string().min(1, 'Region is required'),
  translations: z.array(translationSchema).length(3),
});

export type BranchFormData = z.infer<typeof branchSchema>;

export const defaultBranchTranslations = (): BranchFormData['translations'] => [
  { languageCode: 'az', name: '' },
  { languageCode: 'en', name: '' },
  { languageCode: 'ru', name: '' },
];
