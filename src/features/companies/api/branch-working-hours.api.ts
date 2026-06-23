import apiClient from '@/shared/lib/axios';
import type { BackendResponse } from '@/shared/types/api';
import type {
  BranchWorkingHour,
  CreateBranchWorkingHourDto,
  UpdateBranchWorkingHourDto,
} from '../types/branch-working-hour.types';

export const branchWorkingHoursApi = {
  list: async (companyId: number, branchId: number): Promise<BranchWorkingHour[]> => {
    const { data } = await apiClient.get<BackendResponse<BranchWorkingHour[]>>(
      `/panel/companies/${companyId}/branches/${branchId}/working-hours`
    );
    return data.data;
  },

  create: async (
    companyId: number,
    branchId: number,
    payload: CreateBranchWorkingHourDto
  ): Promise<BranchWorkingHour> => {
    const { data } = await apiClient.post<BackendResponse<BranchWorkingHour>>(
      `/panel/companies/${companyId}/branches/${branchId}/working-hours`,
      payload
    );
    return data.data;
  },

  update: async (
    companyId: number,
    branchId: number,
    id: number,
    payload: UpdateBranchWorkingHourDto
  ): Promise<BranchWorkingHour> => {
    const { data } = await apiClient.put<BackendResponse<BranchWorkingHour>>(
      `/panel/companies/${companyId}/branches/${branchId}/working-hours/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (companyId: number, branchId: number, id: number): Promise<void> => {
    await apiClient.delete(
      `/panel/companies/${companyId}/branches/${branchId}/working-hours/${id}`
    );
  },
};
