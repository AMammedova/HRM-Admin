export interface BranchTranslation {
  languageCode: 'az' | 'en' | 'ru';
  name: string;
}

export interface BranchListItem extends Record<string, unknown> {
  id: number;
  code: string;
  name: string;
  phone: string;
  email: string;
  region: string;
  isActive: boolean;
  isOffice: boolean;
}

export interface Branch {
  id: number;
  companyId: number;
  legacyId?: number | null;
  code: string;
  isActive: boolean;
  isOffice: boolean;
  phone: string;
  email: string;
  address: string | null;
  region: string;
  translations: BranchTranslation[];
}

export interface BranchWorkHour {
  id?: number;
  dayNo: number;
  dayName?: string;
  startTime?: string | null;
  endTime?: string | null;
  isWorkingDay?: boolean;
}

export interface BranchDetail extends Branch {
  workHours?: BranchWorkHour[];
}

export interface CreateBranchDto {
  companyId: number;
  code: string;
  isActive: boolean;
  isOffice: boolean;
  phone: string;
  email: string;
  address: string;
  region: string;
  translations: BranchTranslation[];
}

export interface UpdateBranchDto extends CreateBranchDto {
  id: number;
}

export interface BranchesListData {
  items: BranchListItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface BranchesQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface BranchDropdownItem {
  id: number;
  code: string;
  name: string;
}
