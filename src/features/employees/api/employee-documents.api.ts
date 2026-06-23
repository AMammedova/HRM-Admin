import apiClient from '@/shared/lib/axios';
import type { BackendResponse } from '@/shared/types/api';
import type {
  CreateEmployeeDocumentDto,
  EmployeeDocument,
  UpdateEmployeeDocumentDto,
} from '../types/employee-document.types';

export const employeeDocumentsApi = {
  list: async (companyId: number, employeeId: number): Promise<EmployeeDocument[]> => {
    const { data } = await apiClient.get<BackendResponse<EmployeeDocument[]>>(
      `/panel/companies/${companyId}/employees/${employeeId}/documents`
    );
    return data.data;
  },

  create: async (
    companyId: number,
    employeeId: number,
    payload: CreateEmployeeDocumentDto
  ): Promise<EmployeeDocument> => {
    const { data } = await apiClient.post<BackendResponse<EmployeeDocument>>(
      `/panel/companies/${companyId}/employees/${employeeId}/documents`,
      payload
    );
    return data.data;
  },

  update: async (
    companyId: number,
    employeeId: number,
    id: number,
    payload: UpdateEmployeeDocumentDto
  ): Promise<EmployeeDocument> => {
    const { data } = await apiClient.put<BackendResponse<EmployeeDocument>>(
      `/panel/companies/${companyId}/employees/${employeeId}/documents/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (companyId: number, employeeId: number, id: number): Promise<void> => {
    await apiClient.delete(
      `/panel/companies/${companyId}/employees/${employeeId}/documents/${id}`
    );
  },
};
