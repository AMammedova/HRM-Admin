export interface CompanyPhone extends Record<string, unknown> {
  id: number;
  companyId: number;
  number: string;
  orderNo: number;
  isFax: boolean;
  isActive: boolean;
}

export interface CreateCompanyPhoneDto {
  companyId: number;
  number: string;
  orderNo: number;
  isFax: boolean;
  isActive: boolean;
}

export interface UpdateCompanyPhoneDto extends CreateCompanyPhoneDto {
  id: number;
}

export interface CompanyPhonesListData {
  items: CompanyPhone[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CompanyPhonesQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
