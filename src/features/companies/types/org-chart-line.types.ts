export interface OrgChartLineTranslation {
  languageCode: 'az' | 'en' | 'ru';
  name: string;
}

export interface OrgChartLineListItem extends Record<string, unknown> {
  id: number;
  code: string;
  name: string;
  isVisible: boolean;
}

export interface OrgChartLine {
  id: number;
  companyId: number;
  code: string;
  isVisible: boolean;
  translations: OrgChartLineTranslation[];
}

export interface OrgChartLineDropdownItem {
  id: number;
  code: string;
  name: string;
  isVisible: boolean;
}

export interface CreateOrgChartLineDto {
  companyId: number;
  code: string;
  isVisible: boolean;
  translations: OrgChartLineTranslation[];
}

export interface UpdateOrgChartLineDto extends CreateOrgChartLineDto {
  id: number;
}

export interface OrgChartLinesListData {
  items: OrgChartLineListItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface OrgChartLinesQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}
