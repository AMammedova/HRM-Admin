import apiClient from '@/shared/lib/axios';
import type { BackendResponse, PaginatedResponse } from '@/shared/types/api';
import type {
  CompanyPdfSignature,
  CompanyPdfSignaturesListData,
  CompanyPdfSignaturesQueryParams,
  CreateCompanyPdfSignatureDto,
  UpdateCompanyPdfSignatureDto,
} from '../types/company-pdf-signature.types';

export const companyPdfSignaturesApi = {
  list: async (
    companyId: number,
    params: CompanyPdfSignaturesQueryParams
  ): Promise<PaginatedResponse<CompanyPdfSignature>> => {
    const { data } = await apiClient.get<BackendResponse<CompanyPdfSignaturesListData>>(
      `/panel/companies/${companyId}/pdf-signatures`,
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

  getById: async (companyId: number, id: number): Promise<CompanyPdfSignature> => {
    const { data } = await apiClient.get<BackendResponse<CompanyPdfSignature>>(
      `/panel/companies/${companyId}/pdf-signatures/${id}`
    );
    return data.data;
  },

  create: async (
    companyId: number,
    payload: CreateCompanyPdfSignatureDto
  ): Promise<CompanyPdfSignature> => {
    const { data } = await apiClient.post<BackendResponse<CompanyPdfSignature>>(
      `/panel/companies/${companyId}/pdf-signatures`,
      payload
    );
    return data.data;
  },

  update: async (
    companyId: number,
    id: number,
    payload: UpdateCompanyPdfSignatureDto
  ): Promise<CompanyPdfSignature> => {
    const { data } = await apiClient.put<BackendResponse<CompanyPdfSignature>>(
      `/panel/companies/${companyId}/pdf-signatures/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (companyId: number, id: number): Promise<void> => {
    await apiClient.delete(`/panel/companies/${companyId}/pdf-signatures/${id}`);
  },
};
