import apiClient from '@/shared/lib/axios';
import type { BackendResponse, PaginatedResponse } from '@/shared/types/api';
import type {
  CompanyPhone,
  CompanyPhonesListData,
  CompanyPhonesQueryParams,
  CreateCompanyPhoneDto,
  UpdateCompanyPhoneDto,
} from '../types/company-phone.types';

export const companyPhonesApi = {
  list: async (
    companyId: number,
    params: CompanyPhonesQueryParams
  ): Promise<PaginatedResponse<CompanyPhone>> => {
    const { data } = await apiClient.get<BackendResponse<CompanyPhonesListData>>(
      `/panel/companies/${companyId}/phones`,
      {
        params: {
          CompanyId: companyId,
          PageNumber: params.page ?? 1,
          PageSize: params.pageSize ?? 10,
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

  getById: async (companyId: number, id: number): Promise<CompanyPhone> => {
    const { data } = await apiClient.get<BackendResponse<CompanyPhone>>(
      `/panel/companies/${companyId}/phones/${id}`
    );
    return data.data;
  },

  create: async (companyId: number, payload: CreateCompanyPhoneDto): Promise<CompanyPhone> => {
    const { data } = await apiClient.post<BackendResponse<CompanyPhone>>(
      `/panel/companies/${companyId}/phones`,
      payload
    );
    return data.data;
  },

  update: async (
    companyId: number,
    id: number,
    payload: UpdateCompanyPhoneDto
  ): Promise<CompanyPhone> => {
    const { data } = await apiClient.put<BackendResponse<CompanyPhone>>(
      `/panel/companies/${companyId}/phones/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (companyId: number, id: number): Promise<void> => {
    await apiClient.delete(`/panel/companies/${companyId}/phones/${id}`);
  },
};
