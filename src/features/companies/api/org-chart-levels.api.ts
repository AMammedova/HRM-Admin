import apiClient from '@/shared/lib/axios';
import type { BackendResponse, PaginatedResponse } from '@/shared/types/api';
import type {
  OrgChartLevel,
  OrgChartLevelDropdownItem,
  OrgChartLevelListItem,
  OrgChartLevelTreeNode,
  OrgChartLevelsListData,
  OrgChartLevelsQueryParams,
  CreateOrgChartLevelDto,
  UpdateOrgChartLevelDto,
} from '../types/org-chart-level.types';

export const orgChartLevelsApi = {
  list: async (
    companyId: number,
    params: OrgChartLevelsQueryParams
  ): Promise<PaginatedResponse<OrgChartLevelListItem>> => {
    const { data } = await apiClient.get<BackendResponse<OrgChartLevelsListData>>(
      `/panel/companies/${companyId}/org-chart-levels`,
      {
        params: {
          CompanyId: companyId,
          PageNumber: params.page ?? 1,
          PageSize: params.pageSize ?? 10,
          Search: params.search || undefined,
          OrgChartLineId: params.orgChartLineId || undefined,
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

  getAll: async (
    companyId: number,
    orgChartLineId?: number
  ): Promise<OrgChartLevelDropdownItem[]> => {
    const { data } = await apiClient.get<BackendResponse<OrgChartLevelDropdownItem[]>>(
      `/panel/companies/${companyId}/org-chart-levels/all`,
      {
        params: { orgChartLineId: orgChartLineId || undefined },
      }
    );
    return data.data;
  },

  getTree: async (
    companyId: number,
    orgChartLineId: number
  ): Promise<OrgChartLevelTreeNode[]> => {
    const { data } = await apiClient.get<BackendResponse<OrgChartLevelTreeNode[]>>(
      `/panel/companies/${companyId}/org-chart-levels/tree`,
      {
        params: { orgChartLineId },
      }
    );
    return data.data;
  },

  getById: async (companyId: number, id: number): Promise<OrgChartLevel> => {
    const { data } = await apiClient.get<BackendResponse<OrgChartLevel>>(
      `/panel/companies/${companyId}/org-chart-levels/${id}`
    );
    return data.data;
  },

  create: async (
    companyId: number,
    payload: CreateOrgChartLevelDto
  ): Promise<OrgChartLevel> => {
    const { data } = await apiClient.post<BackendResponse<OrgChartLevel>>(
      `/panel/companies/${companyId}/org-chart-levels`,
      payload
    );
    return data.data;
  },

  update: async (
    companyId: number,
    id: number,
    payload: UpdateOrgChartLevelDto
  ): Promise<OrgChartLevel> => {
    const { data } = await apiClient.put<BackendResponse<OrgChartLevel>>(
      `/panel/companies/${companyId}/org-chart-levels/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (companyId: number, id: number): Promise<void> => {
    await apiClient.delete(`/panel/companies/${companyId}/org-chart-levels/${id}`);
  },

  toggleStatus: async (companyId: number, id: number): Promise<void> => {
    await apiClient.patch(`/panel/companies/${companyId}/org-chart-levels/${id}/status`);
  },

  exportCsv: async (companyId: number): Promise<Blob> => {
    const { data } = await apiClient.get(
      `/panel/companies/${companyId}/org-chart-levels/export`,
      { responseType: 'blob' }
    );
    return data;
  },
};
