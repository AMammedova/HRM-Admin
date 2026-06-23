export interface CompanyTypeTranslation {
  languageCode: 'az' | 'en' | 'ru';
  name: string;
}

export interface CompanyTypeListItem extends Record<string, unknown> {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CompanyType {
  id: number;
  code: string;
  isActive: boolean;
  sortOrder: number;
  translations: CompanyTypeTranslation[];
}

export interface CreateCompanyTypeDto {
  code: string;
  translations: CompanyTypeTranslation[];
}

export interface UpdateCompanyTypeDto {
  id: number;
  code: string;
  sortOrder: number;
  translations: CompanyTypeTranslation[];
}

export interface UpdateCompanyTypeSortOrderDto {
  id: number;
  sortOrder: number;
}

export interface CompanyTypesListData {
  items: CompanyTypeListItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CompanyTypesQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: number;
  sortDesc?: boolean;
}

/** SortBy enum values from API: 0 = Code, 1 = Name, 2 = SortOrder */
export const COMPANY_TYPE_SORT_BY = {
  CODE: 0,
  NAME: 1,
  SORT_ORDER: 2,
} as const;

export type CompanyTypeSortBy =
  (typeof COMPANY_TYPE_SORT_BY)[keyof typeof COMPANY_TYPE_SORT_BY];
