export interface OvertimeSettingTranslation {
  languageCode: 'az' | 'en' | 'ru';
  name: string;
}

export interface OvertimeSettingListItem extends Record<string, unknown> {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
}

export interface OvertimeSetting {
  id: number;
  code: string;
  isActive: boolean;
  sortOrder: number;
  translations: OvertimeSettingTranslation[];
}

export interface CreateOvertimeSettingDto {
  code: string;
  translations: OvertimeSettingTranslation[];
}

export interface UpdateOvertimeSettingDto {
  id: number;
  code: string;
  translations: OvertimeSettingTranslation[];
}

export interface UpdateOvertimeSettingSortOrderDto {
  items: Array<{ id: number; sortOrder: number }>;
}

export interface OvertimeSettingsListData {
  items: OvertimeSettingListItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface OvertimeSettingsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}
