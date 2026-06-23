export interface CompanyPdfSignature extends Record<string, unknown> {
  id: number;
  companyId: number;
  name: string;
  content: string;
  filePath: string;
  isActive: boolean;
}

export interface CreateCompanyPdfSignatureDto {
  companyId: number;
  name: string;
  content: string;
  filePath: string;
  isActive: boolean;
}

export interface UpdateCompanyPdfSignatureDto extends CreateCompanyPdfSignatureDto {
  id: number;
}

export interface CompanyPdfSignaturesListData {
  items: CompanyPdfSignature[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CompanyPdfSignaturesQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
