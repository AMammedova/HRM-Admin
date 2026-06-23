import apiClient from '@/shared/lib/axios';
import type { BackendResponse, PaginatedResponse } from '@/shared/types/api';
import type {
  CompanyType,
  CompanyTypeListItem,
  CompanyTypesListData,
  CompanyTypesQueryParams,
  CreateCompanyTypeDto,
  UpdateCompanyTypeDto,
  UpdateCompanyTypeSortOrderDto,
} from '../types/company-type.types';

export const companyTypesApi = {
  list: async (
    params: CompanyTypesQueryParams
  ): Promise<PaginatedResponse<CompanyTypeListItem>> => {
    const { data } = await apiClient.get<BackendResponse<CompanyTypesListData>>(
      '/panel/company-types',
      {
        params: {
          PageNumber: params.page ?? 1,
          PageSize: params.pageSize ?? 10,
          Search: params.search || undefined,
          IsActive: params.isActive,
          SortBy: params.sortBy,
          SortDesc: params.sortDesc,
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

  getAll: async (): Promise<CompanyTypeListItem[]> => {
    const { data } = await apiClient.get<BackendResponse<CompanyTypeListItem[]>>(
      '/panel/company-types/all'
    );
    return data.data;
  },

  getById: async (id: number): Promise<CompanyType> => {
    const { data } = await apiClient.get<BackendResponse<CompanyType>>(
      `/panel/company-types/${id}`
    );
    return data.data;
  },

  create: async (payload: CreateCompanyTypeDto): Promise<CompanyType> => {
    const { data } = await apiClient.post<BackendResponse<CompanyType>>(
      '/panel/company-types',
      payload
    );
    return data.data;
  },

  update: async (id: number, payload: UpdateCompanyTypeDto): Promise<CompanyType> => {
    const { data } = await apiClient.put<BackendResponse<CompanyType>>(
      `/panel/company-types/${id}`,
      payload
    );
    return data.data;
  },

  toggleStatus: async (id: number): Promise<void> => {
    await apiClient.patch(`/panel/company-types/${id}/status`);
  },

  updateSortOrder: async (payload: UpdateCompanyTypeSortOrderDto): Promise<void> => {
    await apiClient.patch('/panel/company-types/sort-order', payload);
  },
};
