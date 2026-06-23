export interface OrgChartLevelTranslation {
  languageCode: 'az' | 'en' | 'ru';
  name: string;
}

export interface OrgChartLevelListItem extends Record<string, unknown> {
  id: number;
  code: string;
  name: string;
  orgChartLineName: string | null;
  parentName: string | null;
  levelNo: number;
  isVisible: boolean;
}

export interface OrgChartLevel {
  id: number;
  companyId: number;
  orgChartLineId: number;
  parentId: number | null;
  rowId: string;
  levelNo: number;
  isVisible: boolean;
  translations: OrgChartLevelTranslation[];
}

export interface OrgChartLevelTreeNode {
  id: number;
  code: string;
  name: string;
  levelNo: number;
  isVisible: boolean;
  children: OrgChartLevelTreeNode[];
}

export interface OrgChartLevelDropdownItem {
  id: number;
  code: string;
  name: string;
  levelNo: number;
  isVisible: boolean;
}

export interface CreateOrgChartLevelDto {
  companyId: number;
  orgChartLineId: number;
  parentId?: number | null;
  code: string;
  isVisible: boolean;
  translations: OrgChartLevelTranslation[];
}

export interface UpdateOrgChartLevelDto extends CreateOrgChartLevelDto {
  id: number;
}

export interface OrgChartLevelsListData {
  items: OrgChartLevelListItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface OrgChartLevelsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  orgChartLineId?: number;
}
