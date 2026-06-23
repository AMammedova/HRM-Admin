export interface BusinessTravelSettingTranslation {
  languageCode: 'az' | 'en' | 'ru';
  name: string;
}

export interface BusinessTravelSettingListItem extends Record<string, unknown> {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
}

export interface BusinessTravelSetting {
  id: number;
  code: string;
  isActive: boolean;
  sortOrder: number;
  translations: BusinessTravelSettingTranslation[];
}

export interface CreateBusinessTravelSettingDto {
  code: string;
  translations: BusinessTravelSettingTranslation[];
}

export interface UpdateBusinessTravelSettingDto {
  id: number;
  code: string;
  translations: BusinessTravelSettingTranslation[];
}

export interface UpdateBusinessTravelSettingSortOrderDto {
  items: Array<{ id: number; sortOrder: number }>;
}

export interface BusinessTravelSettingsListData {
  items: BusinessTravelSettingListItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface BusinessTravelSettingsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}
