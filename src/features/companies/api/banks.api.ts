import apiClient from '@/shared/lib/axios';
import type { BackendResponse, PaginatedResponse } from '@/shared/types/api';
import type {
  Bank,
  BankDropdownItem,
  BankListItem,
  BanksListData,
  BanksQueryParams,
  CreateBankDto,
  UpdateBankDto,
} from '../types/bank.types';

export const banksApi = {
  list: async (
    companyId: number,
    params: BanksQueryParams
  ): Promise<PaginatedResponse<BankListItem>> => {
    const { data } = await apiClient.get<BackendResponse<BanksListData>>(
      `/panel/companies/${companyId}/banks`,
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

  getAll: async (companyId: number): Promise<BankDropdownItem[]> => {
    const { data } = await apiClient.get<BackendResponse<BankDropdownItem[]>>(
      `/panel/companies/${companyId}/banks/all`
    );
    return data.data;
  },

  getById: async (companyId: number, id: number): Promise<Bank> => {
    const { data } = await apiClient.get<BackendResponse<Bank>>(
      `/panel/companies/${companyId}/banks/${id}`
    );
    return data.data;
  },

  create: async (companyId: number, payload: CreateBankDto): Promise<Bank> => {
    const { data } = await apiClient.post<BackendResponse<Bank>>(
      `/panel/companies/${companyId}/banks`,
      payload
    );
    return data.data;
  },

  update: async (companyId: number, id: number, payload: UpdateBankDto): Promise<Bank> => {
    const { data } = await apiClient.put<BackendResponse<Bank>>(
      `/panel/companies/${companyId}/banks/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (companyId: number, id: number): Promise<void> => {
    await apiClient.delete(`/panel/companies/${companyId}/banks/${id}`);
  },

  toggleStatus: async (companyId: number, id: number): Promise<void> => {
    await apiClient.patch(`/panel/companies/${companyId}/banks/${id}/status`);
  },
};
