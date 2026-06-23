export interface EmployeeTranslation {
  languageCode: 'az' | 'en' | 'ru';
  surname: string;
  name: string;
  fatherName: string;
}

export interface EmployeeListItem {
  id: number;
  code: string;
  fullName: string;
  birthDate: string;
  gender: boolean;
  isActive: boolean;
}

export interface Employee {
  id: number;
  companyId: number;
  code: string;
  birthDate: string;
  birthPlace: string;
  citizenship: string;
  gender: boolean;
  socialCardNum: string;
  bloodGroupLookupValueId: number;
  isMarried: boolean;
  hasDriverLicense: boolean;
  hasMilitaryService: boolean;
  militaryCardNum: string;
  academicDegree: string;
  isForeignNational: boolean;
  isTaxCalculated: boolean;
  maxDeductionPercent: number;
  autoCalcOvertime: boolean;
  vacationPercent: number;
  translations: EmployeeTranslation[];
}

export interface EmployeeDetail extends Employee {
  [key: string]: unknown;
}

export interface CreateEmployeeDto {
  companyId: number;
  code: string;
  birthDate: string;
  birthPlace: string;
  citizenship: string;
  gender: boolean;
  socialCardNum: string;
  bloodGroupLookupValueId: number;
  isMarried: boolean;
  hasDriverLicense: boolean;
  hasMilitaryService: boolean;
  militaryCardNum: string;
  academicDegree: string;
  isForeignNational: boolean;
  isTaxCalculated: boolean;
  maxDeductionPercent: number;
  autoCalcOvertime: boolean;
  vacationPercent: number;
  translations: EmployeeTranslation[];
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {
  id: number;
}

export interface EmployeesListData {
  items: EmployeeListItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface EmployeesQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface EmployeeDropdownItem {
  id: number;
  code: string;
  name: string;
}

export function getEmployeeTranslation(
  translations: EmployeeTranslation[],
  locale: string
): EmployeeTranslation | undefined {
  return (
    translations.find((tr) => tr.languageCode === locale) ??
    translations.find((tr) => tr.languageCode === 'az') ??
    translations[0]
  );
}

export function formatEmployeeDate(value?: string | null): string {
  if (!value) return '—';
  return value.slice(0, 10);
}

export function getInitialsFromFullName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}
