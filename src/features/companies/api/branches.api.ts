import apiClient from '@/shared/lib/axios';
import type { BackendResponse, PaginatedResponse } from '@/shared/types/api';
import type {
  Branch,
  BranchDetail,
  BranchDropdownItem,
  BranchListItem,
  BranchesListData,
  BranchesQueryParams,
  CreateBranchDto,
  UpdateBranchDto,
} from '../types/branch.types';

export const branchesApi = {
  list: async (
    companyId: number,
    params: BranchesQueryParams
  ): Promise<PaginatedResponse<BranchListItem>> => {
    const { data } = await apiClient.get<BackendResponse<BranchesListData>>(
      `/panel/companies/${companyId}/branches`,
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

  getAll: async (companyId: number): Promise<BranchDropdownItem[]> => {
    const { data } = await apiClient.get<BackendResponse<BranchDropdownItem[]>>(
      `/panel/companies/${companyId}/branches/all`
    );
    return data.data;
  },

  getById: async (companyId: number, id: number): Promise<Branch> => {
    const { data } = await apiClient.get<BackendResponse<Branch>>(
      `/panel/companies/${companyId}/branches/${id}`
    );
    return data.data;
  },

  getDetail: async (companyId: number, id: number): Promise<BranchDetail> => {
    const { data } = await apiClient.get<BackendResponse<BranchDetail>>(
      `/panel/companies/${companyId}/branches/${id}/detail`
    );
    return data.data;
  },

  create: async (companyId: number, payload: CreateBranchDto): Promise<Branch> => {
    const { data } = await apiClient.post<BackendResponse<Branch>>(
      `/panel/companies/${companyId}/branches`,
      payload
    );
    return data.data;
  },

  update: async (companyId: number, id: number, payload: UpdateBranchDto): Promise<Branch> => {
    const { data } = await apiClient.put<BackendResponse<Branch>>(
      `/panel/companies/${companyId}/branches/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (companyId: number, id: number): Promise<void> => {
    await apiClient.delete(`/panel/companies/${companyId}/branches/${id}`);
  },

  toggleStatus: async (companyId: number, id: number): Promise<void> => {
    await apiClient.patch(`/panel/companies/${companyId}/branches/${id}/status`);
  },
};
