import { z } from 'zod';

const translationSchema = z.object({
  languageCode: z.enum(['az', 'en', 'ru']),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export const bankSchema = z.object({
  companyId: z.number().int().positive(),
  code: z.string().min(1, 'Code is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  address: z.string().min(1, 'Address is required'),
  swiftCode: z.string().min(1, 'SWIFT code is required'),
  correspondentAccount: z.string().min(1, 'Correspondent account is required'),
  settlementAccount: z.string().min(1, 'Settlement account is required'),
  isActive: z.boolean(),
  translations: z.array(translationSchema).length(3),
});

export type BankFormData = z.infer<typeof bankSchema>;

export const defaultBankTranslations = (): BankFormData['translations'] => [
  { languageCode: 'az', name: '', description: '' },
  { languageCode: 'en', name: '', description: '' },
  { languageCode: 'ru', name: '', description: '' },
];
