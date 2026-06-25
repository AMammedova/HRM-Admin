import apiClient from '@/shared/lib/axios';
import type { BackendResponse, PaginatedResponse } from '@/shared/types/api';
import type {
  OvertimeSetting,
  OvertimeSettingListItem,
  OvertimeSettingsListData,
  OvertimeSettingsQueryParams,
  CreateOvertimeSettingDto,
  UpdateOvertimeSettingDto,
  UpdateOvertimeSettingSortOrderDto,
} from '../types/overtime-setting.types';

export const overtimeSettingsApi = {
  list: async (
    params: OvertimeSettingsQueryParams
  ): Promise<PaginatedResponse<OvertimeSettingListItem>> => {
    const { data } = await apiClient.get<BackendResponse<OvertimeSettingsListData>>(
      '/panel/overtime-settings',
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

  getAll: async (): Promise<OvertimeSettingListItem[]> => {
    const { data } = await apiClient.get<BackendResponse<OvertimeSettingListItem[]>>(
      '/panel/overtime-settings/all'
    );
    return data.data;
  },

  getById: async (id: number): Promise<OvertimeSetting> => {
    const { data } = await apiClient.get<BackendResponse<OvertimeSetting>>(
      `/panel/overtime-settings/${id}`
    );
    return data.data;
  },

  create: async (payload: CreateOvertimeSettingDto): Promise<OvertimeSetting> => {
    const { data } = await apiClient.post<BackendResponse<OvertimeSetting>>(
      '/panel/overtime-settings',
      payload
    );
    return data.data;
  },

  update: async (id: number, payload: UpdateOvertimeSettingDto): Promise<OvertimeSetting> => {
    const { data } = await apiClient.put<BackendResponse<OvertimeSetting>>(
      `/panel/overtime-settings/${id}`,
      payload
    );
    return data.data;
  },

  toggleStatus: async (id: number): Promise<void> => {
    await apiClient.patch(`/panel/overtime-settings/${id}/status`);
  },

  updateSortOrder: async (payload: UpdateOvertimeSettingSortOrderDto): Promise<void> => {
    await apiClient.patch('/panel/overtime-settings/sort-order', payload);
  },
};
