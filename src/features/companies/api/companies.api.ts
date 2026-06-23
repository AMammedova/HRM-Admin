import apiClient from '@/shared/lib/axios';
import type { BackendResponse, PaginatedResponse, QueryParams } from '@/shared/types/api';
import type {
  Company,
  CompanyDetail,
  CompaniesListData,
  CompanyListItem,
  CreateCompanyDto,
  UpdateCompanyDto,
} from '../types/company.types';

export const companiesApi = {
  list: async (params: QueryParams): Promise<PaginatedResponse<CompanyListItem>> => {
    const { data } = await apiClient.get<BackendResponse<CompaniesListData>>(
      '/panel/companies',
      {
        params: {
          PageNumber: params.page ?? 1,
          PageSize: params.pageSize ?? 10,
          Search: params.search || undefined,
          SortBy: params.sortBy || undefined,
          SortDirection: params.sortOrder || undefined,
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

  getById: async (id: number): Promise<Company> => {
    const { data } = await apiClient.get<BackendResponse<Company>>(
      `/panel/companies/${id}`
    );
    return data.data;
  },

  getDetail: async (id: number): Promise<CompanyDetail> => {
    const { data } = await apiClient.get<BackendResponse<CompanyDetail>>(
      `/panel/companies/${id}/detail`
    );
    return data.data;
  },

  create: async (payload: CreateCompanyDto): Promise<Company> => {
    const { data } = await apiClient.post<BackendResponse<Company>>(
      '/panel/companies',
      payload
    );
    return data.data;
  },

  update: async (id: number, payload: UpdateCompanyDto): Promise<Company> => {
    const { data } = await apiClient.put<BackendResponse<Company>>(
      `/panel/companies/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/panel/companies/${id}`);
  },

  toggleStatus: async (id: number): Promise<void> => {
    await apiClient.patch(`/panel/companies/${id}/status`);
  },
};
