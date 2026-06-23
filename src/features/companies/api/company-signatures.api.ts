import apiClient from '@/shared/lib/axios';
import type { BackendResponse, PaginatedResponse } from '@/shared/types/api';
import type {
  CompanySignature,
  CompanySignaturesListData,
  CompanySignaturesQueryParams,
  CreateCompanySignatureDto,
  UpdateCompanySignatureDto,
} from '../types/company-signature.types';

export const companySignaturesApi = {
  list: async (
    companyId: number,
    params: CompanySignaturesQueryParams
  ): Promise<PaginatedResponse<CompanySignature>> => {
    const { data } = await apiClient.get<BackendResponse<CompanySignaturesListData>>(
      `/panel/companies/${companyId}/signatures`,
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

  getById: async (companyId: number, id: number): Promise<CompanySignature> => {
    const { data } = await apiClient.get<BackendResponse<CompanySignature>>(
      `/panel/companies/${companyId}/signatures/${id}`
    );
    return data.data;
  },

  create: async (
    companyId: number,
    payload: CreateCompanySignatureDto
  ): Promise<CompanySignature> => {
    const { data } = await apiClient.post<BackendResponse<CompanySignature>>(
      `/panel/companies/${companyId}/signatures`,
      payload
    );
    return data.data;
  },

  update: async (
    companyId: number,
    id: number,
    payload: UpdateCompanySignatureDto
  ): Promise<CompanySignature> => {
    const { data } = await apiClient.put<BackendResponse<CompanySignature>>(
      `/panel/companies/${companyId}/signatures/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (companyId: number, id: number): Promise<void> => {
    await apiClient.delete(`/panel/companies/${companyId}/signatures/${id}`);
  },
};
