import apiClient from '@/shared/lib/axios';
import type { BackendResponse, PaginatedResponse } from '@/shared/types/api';
import type {
  OrgChartLine,
  OrgChartLineDropdownItem,
  OrgChartLineListItem,
  OrgChartLinesListData,
  OrgChartLinesQueryParams,
  CreateOrgChartLineDto,
  UpdateOrgChartLineDto,
} from '../types/org-chart-line.types';

export const orgChartLinesApi = {
  list: async (
    companyId: number,
    params: OrgChartLinesQueryParams
  ): Promise<PaginatedResponse<OrgChartLineListItem>> => {
    const { data } = await apiClient.get<BackendResponse<OrgChartLinesListData>>(
      `/panel/companies/${companyId}/org-chart-lines`,
      {
        params: {
          CompanyId: companyId,
          PageNumber: params.page ?? 1,
          PageSize: params.pageSize ?? 10,
          Search: params.search || undefined,
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

  getAll: async (companyId: number): Promise<OrgChartLineDropdownItem[]> => {
    const { data } = await apiClient.get<BackendResponse<OrgChartLineDropdownItem[]>>(
      `/panel/companies/${companyId}/org-chart-lines/all`
    );
    return data.data;
  },

  getById: async (companyId: number, id: number): Promise<OrgChartLine> => {
    const { data } = await apiClient.get<BackendResponse<OrgChartLine>>(
      `/panel/companies/${companyId}/org-chart-lines/${id}`
    );
    return data.data;
  },

  create: async (companyId: number, payload: CreateOrgChartLineDto): Promise<OrgChartLine> => {
    const { data } = await apiClient.post<BackendResponse<OrgChartLine>>(
      `/panel/companies/${companyId}/org-chart-lines`,
      payload
    );
    return data.data;
  },

  update: async (
    companyId: number,
    id: number,
    payload: UpdateOrgChartLineDto
  ): Promise<OrgChartLine> => {
    const { data } = await apiClient.put<BackendResponse<OrgChartLine>>(
      `/panel/companies/${companyId}/org-chart-lines/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (companyId: number, id: number): Promise<void> => {
    await apiClient.delete(`/panel/companies/${companyId}/org-chart-lines/${id}`);
  },

  toggleStatus: async (companyId: number, id: number): Promise<void> => {
    await apiClient.patch(`/panel/companies/${companyId}/org-chart-lines/${id}/status`);
  },
};
