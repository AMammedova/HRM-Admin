export interface PositionTranslation {
  languageCode: 'az' | 'en' | 'ru';
  name: string;
  description?: string | null;
}

export interface PositionListItem extends Record<string, unknown> {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  isBlueCollar: boolean;
  vacationNorm: number;
  orgChartLevelName: string | null;
}

export interface Position {
  id: number;
  companyId: number;
  orgChartLevelId: number | null;
  code: string;
  isActive: boolean;
  isBlueCollar: boolean;
  vacationNorm: number;
  isAccordWorkCondition: boolean;
  accordWorkConditionDay: number;
  translations: PositionTranslation[];
}

export interface PositionDropdownItem {
  id: number;
  name: string;
  code: string;
}

export interface CreatePositionDto {
  companyId: number;
  orgChartLevelId?: number | null;
  code: string;
  isActive: boolean;
  isBlueCollar: boolean;
  vacationNorm: number;
  isAccordWorkCondition: boolean;
  accordWorkConditionDay: number;
  translations: PositionTranslation[];
}

export interface UpdatePositionDto extends CreatePositionDto {
  id: number;
}

export interface PositionsListData {
  items: PositionListItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PositionsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  orgChartLevelId?: number;
}
