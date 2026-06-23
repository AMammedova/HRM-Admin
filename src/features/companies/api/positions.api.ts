import apiClient from '@/shared/lib/axios';
import type { BackendResponse, PaginatedResponse } from '@/shared/types/api';
import type {
  Position,
  PositionDropdownItem,
  PositionListItem,
  PositionsListData,
  PositionsQueryParams,
  CreatePositionDto,
  UpdatePositionDto,
} from '../types/position.types';

export const positionsApi = {
  list: async (
    companyId: number,
    params: PositionsQueryParams
  ): Promise<PaginatedResponse<PositionListItem>> => {
    const { data } = await apiClient.get<BackendResponse<PositionsListData>>(
      `/panel/companies/${companyId}/positions`,
      {
        params: {
          CompanyId: companyId,
          PageNumber: params.page ?? 1,
          PageSize: params.pageSize ?? 10,
          Search: params.search || undefined,
          OrgChartLevelId: params.orgChartLevelId || undefined,
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

  getAll: async (companyId: number): Promise<PositionDropdownItem[]> => {
    const { data } = await apiClient.get<BackendResponse<PositionDropdownItem[]>>(
      `/panel/companies/${companyId}/positions/all`
    );
    return data.data;
  },

  getById: async (companyId: number, id: number): Promise<Position> => {
    const { data } = await apiClient.get<BackendResponse<Position>>(
      `/panel/companies/${companyId}/positions/${id}`
    );
    return data.data;
  },

  create: async (companyId: number, payload: CreatePositionDto): Promise<Position> => {
    const { data } = await apiClient.post<BackendResponse<Position>>(
      `/panel/companies/${companyId}/positions`,
      payload
    );
    return data.data;
  },

  update: async (companyId: number, id: number, payload: UpdatePositionDto): Promise<Position> => {
    const { data } = await apiClient.put<BackendResponse<Position>>(
      `/panel/companies/${companyId}/positions/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (companyId: number, id: number): Promise<void> => {
    await apiClient.delete(`/panel/companies/${companyId}/positions/${id}`);
  },

  toggleStatus: async (companyId: number, id: number): Promise<void> => {
    await apiClient.patch(`/panel/companies/${companyId}/positions/${id}/status`);
  },
};
