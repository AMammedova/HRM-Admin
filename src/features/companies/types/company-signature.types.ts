export interface CompanySignature extends Record<string, unknown> {
  id: number;
  companyId: number;
  orderNo: number;
  fullName: string;
  position: string;
  isActive: boolean;
}

export interface CreateCompanySignatureDto {
  companyId: number;
  orderNo: number;
  fullName: string;
  position: string;
  isActive: boolean;
}

export interface UpdateCompanySignatureDto extends CreateCompanySignatureDto {
  id: number;
}

export interface CompanySignaturesListData {
  items: CompanySignature[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CompanySignaturesQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
