import { z } from 'zod';

const translationSchema = z.object({
  languageCode: z.enum(['az', 'en', 'ru']),
  surname: z.string().min(1, 'Surname is required'),
  name: z.string().min(1, 'Name is required'),
  fatherName: z.string().default(''),
});

export const employeeSchema = z.object({
  companyId: z.number().int().positive(),
  code: z.string().min(1, 'Code is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  birthPlace: z.string().min(1, 'Birth place is required'),
  citizenship: z.string().min(1, 'Citizenship is required'),
  gender: z.boolean(),
  socialCardNum: z.string().min(1, 'Social card number is required'),
  bloodGroupLookupValueId: z.coerce.number().int().min(0),
  isMarried: z.boolean(),
  hasDriverLicense: z.boolean(),
  hasMilitaryService: z.boolean(),
  militaryCardNum: z.string().default(''),
  academicDegree: z.string().default(''),
  isForeignNational: z.boolean(),
  isTaxCalculated: z.boolean(),
  maxDeductionPercent: z.coerce.number().int().min(0).max(100),
  autoCalcOvertime: z.boolean(),
  vacationPercent: z.coerce.number().int().min(0).max(100),
  translations: z.array(translationSchema).length(3),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

export const defaultEmployeeTranslations = (): EmployeeFormData['translations'] => [
  { languageCode: 'az', surname: '', name: '', fatherName: '' },
  { languageCode: 'en', surname: '', name: '', fatherName: '' },
  { languageCode: 'ru', surname: '', name: '', fatherName: '' },
];

export function toDateInputValue(value?: string | null): string {
  if (!value) return '';
  return value.slice(0, 10);
}

export function toApiDateTime(value: string): string {
  if (!value) return value;
  if (value.includes('T')) return value;
  return `${value}T00:00:00.000Z`;
}
