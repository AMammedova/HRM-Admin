import apiClient from '@/shared/lib/axios';
import type { BackendResponse } from '@/shared/types/api';
import type {
  CreateEmployeeEducationDto,
  EmployeeEducation,
  UpdateEmployeeEducationDto,
} from '../types/employee-education.types';

export const employeeEducationsApi = {
  list: async (companyId: number, employeeId: number): Promise<EmployeeEducation[]> => {
    const { data } = await apiClient.get<BackendResponse<EmployeeEducation[]>>(
      `/panel/companies/${companyId}/employees/${employeeId}/educations`
    );
    return data.data;
  },

  getById: async (
    companyId: number,
    employeeId: number,
    id: number
  ): Promise<EmployeeEducation> => {
    const { data } = await apiClient.get<BackendResponse<EmployeeEducation>>(
      `/panel/companies/${companyId}/employees/${employeeId}/educations/${id}`
    );
    return data.data;
  },

  create: async (
    companyId: number,
    employeeId: number,
    payload: CreateEmployeeEducationDto
  ): Promise<EmployeeEducation> => {
    const { data } = await apiClient.post<BackendResponse<EmployeeEducation>>(
      `/panel/companies/${companyId}/employees/${employeeId}/educations`,
      payload
    );
    return data.data;
  },

  update: async (
    companyId: number,
    employeeId: number,
    id: number,
    payload: UpdateEmployeeEducationDto
  ): Promise<EmployeeEducation> => {
    const { data } = await apiClient.put<BackendResponse<EmployeeEducation>>(
      `/panel/companies/${companyId}/employees/${employeeId}/educations/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (companyId: number, employeeId: number, id: number): Promise<void> => {
    await apiClient.delete(
      `/panel/companies/${companyId}/employees/${employeeId}/educations/${id}`
    );
  },
};
