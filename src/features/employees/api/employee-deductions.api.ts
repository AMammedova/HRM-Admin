import apiClient from '@/shared/lib/axios';
import type { BackendResponse } from '@/shared/types/api';
import type {
  CreateEmployeeDeductionDto,
  EmployeeDeduction,
  UpdateEmployeeDeductionDto,
} from '../types/employee-deduction.types';

export const employeeDeductionsApi = {
  list: async (companyId: number, employeeId: number): Promise<EmployeeDeduction[]> => {
    const { data } = await apiClient.get<BackendResponse<EmployeeDeduction[]>>(
      `/panel/companies/${companyId}/employees/${employeeId}/deductions`
    );
    return data.data;
  },

  getById: async (
    companyId: number,
    employeeId: number,
    id: number
  ): Promise<EmployeeDeduction> => {
    const { data } = await apiClient.get<BackendResponse<EmployeeDeduction>>(
      `/panel/companies/${companyId}/employees/${employeeId}/deductions/${id}`
    );
    return data.data;
  },

  create: async (
    companyId: number,
    employeeId: number,
    payload: CreateEmployeeDeductionDto
  ): Promise<EmployeeDeduction> => {
    const { data } = await apiClient.post<BackendResponse<EmployeeDeduction>>(
      `/panel/companies/${companyId}/employees/${employeeId}/deductions`,
      payload
    );
    return data.data;
  },

  update: async (
    companyId: number,
    employeeId: number,
    id: number,
    payload: UpdateEmployeeDeductionDto
  ): Promise<EmployeeDeduction> => {
    const { data } = await apiClient.put<BackendResponse<EmployeeDeduction>>(
      `/panel/companies/${companyId}/employees/${employeeId}/deductions/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (companyId: number, employeeId: number, id: number): Promise<void> => {
    await apiClient.delete(
      `/panel/companies/${companyId}/employees/${employeeId}/deductions/${id}`
    );
  },

  toggleStatus: async (
    companyId: number,
    employeeId: number,
    id: number
  ): Promise<void> => {
    await apiClient.patch(
      `/panel/companies/${companyId}/employees/${employeeId}/deductions/${id}/status`
    );
  },
};
