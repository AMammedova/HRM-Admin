import apiClient from '@/shared/lib/axios';
import type { BackendResponse, PaginatedResponse } from '@/shared/types/api';
import type {
  BusinessTravelSetting,
  BusinessTravelSettingListItem,
  BusinessTravelSettingsListData,
  BusinessTravelSettingsQueryParams,
  CreateBusinessTravelSettingDto,
  UpdateBusinessTravelSettingDto,
  UpdateBusinessTravelSettingSortOrderDto,
} from '../types/business-travel-setting.types';

export const businessTravelSettingsApi = {
  list: async (
    params: BusinessTravelSettingsQueryParams
  ): Promise<PaginatedResponse<BusinessTravelSettingListItem>> => {
    const { data } = await apiClient.get<BackendResponse<BusinessTravelSettingsListData>>(
      '/panel/business-travel-settings',
      {
        params: {
          PageNumber: params.page ?? 1,
          PageSize: params.pageSize ?? 10,
          Search: params.search || undefined,
          SortBy: params.sortBy || undefined,
          SortDirection: params.sortDirection || undefined,
        },
      }
    );

    return {
      data: data.data.items,
      pagination: {
        page: data.data.pageNumber,
        pageSize: params.pageSize ?? 10,
        total: data.data.totalCount,
        totalPages: data.data.totalPages,
      },
    };
  },

  getAll: async (): Promise<BusinessTravelSettingListItem[]> => {
    const { data } = await apiClient.get<BackendResponse<BusinessTravelSettingListItem[]>>(
      '/panel/business-travel-settings/all'
    );
    return data.data;
  },

  getById: async (id: number): Promise<BusinessTravelSetting> => {
    const { data } = await apiClient.get<BackendResponse<BusinessTravelSetting>>(
      `/panel/business-travel-settings/${id}`
    );
    return data.data;
  },

  create: async (payload: CreateBusinessTravelSettingDto): Promise<BusinessTravelSetting> => {
    const { data } = await apiClient.post<BackendResponse<BusinessTravelSetting>>(
      '/panel/business-travel-settings',
      payload
    );
    return data.data;
  },

  update: async (
    id: number,
    payload: UpdateBusinessTravelSettingDto
  ): Promise<BusinessTravelSetting> => {
    const { data } = await apiClient.put<BackendResponse<BusinessTravelSetting>>(
      `/panel/business-travel-settings/${id}`,
      payload
    );
    return data.data;
  },

  toggleStatus: async (id: number): Promise<void> => {
    await apiClient.patch(`/panel/business-travel-settings/${id}/status`);
  },

  updateSortOrder: async (payload: UpdateBusinessTravelSettingSortOrderDto): Promise<void> => {
    await apiClient.patch('/panel/business-travel-settings/sort-order', payload);
  },
};
