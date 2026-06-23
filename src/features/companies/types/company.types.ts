export interface CompanyTranslation {
  languageCode: 'az' | 'en' | 'ru';
  name: string;
  factAddress: string;
  legalAddress: string;
}

export interface CompanyListItem extends Record<string, unknown> {
  id: number;
  compCode: string;
  name: string;
  email: string;
  taxId: string;
  companyTypeName: string;
  isActive: boolean;
}

export interface Company {
  id: number;
  compCode: string;
  taxId: string;
  email: string;
  isActive: boolean;
  companyTypeId: number;
  businessTravelSettingId: number | null;
  overtimeSettingId: number | null;
  timesheetPeriodTypeId: number;
  translations: CompanyTranslation[];
}

export interface LookupItem {
  id: number;
  code: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CompanyDetail extends Omit<Company, 'companyTypeId' | 'timesheetPeriodTypeId'> {
  companyType: LookupItem;
  timesheetPeriodType: LookupItem;
  phones: unknown[];
  settings: unknown | null;
  signatures: unknown[];
  pdfSignatures: unknown[];
  workCalendars: WorkCalendar[];
}

export interface WorkCalendarTranslation {
  id: number;
  workCalendarId: number;
  languageCode: string;
  name: string;
}

export interface WorkCalendarDaySetting {
  id: number;
  workCalendarId: number;
  dayNo: number;
  value: string;
  isActive: boolean;
}

export interface WorkCalendar {
  id: number;
  companyId: number;
  code: string;
  defaultHours: number;
  isActive: boolean;
  translations: WorkCalendarTranslation[];
  daySettings: WorkCalendarDaySetting[];
}

export interface CreateCompanyDto {
  compCode: string;
  taxId: string;
  email: string;
  companyTypeId: number;
  businessTravelSettingId?: number | null;
  overtimeSettingId?: number | null;
  timesheetPeriodTypeId: number;
  translations: CompanyTranslation[];
}

export interface UpdateCompanyDto extends CreateCompanyDto {
  id: number;
}

export interface CompaniesListData {
  items: CompanyListItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
