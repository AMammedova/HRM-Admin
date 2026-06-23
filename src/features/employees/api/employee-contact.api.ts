import axios from 'axios';
import apiClient from '@/shared/lib/axios';
import type { BackendResponse } from '@/shared/types/api';
import type { EmployeeContact, UpsertEmployeeContactDto } from '../types/employee-contact.types';
import { defaultEmployeeContact } from '../types/employee-contact.types';

export const employeeContactApi = {
  get: async (companyId: number, employeeId: number): Promise<EmployeeContact> => {
    try {
      const { data } = await apiClient.get<BackendResponse<EmployeeContact>>(
        `/panel/companies/${companyId}/employees/${employeeId}/contact`
      );
      return data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return defaultEmployeeContact(companyId, employeeId);
      }
      throw error;
    }
  },

  upsert: async (
    companyId: number,
    employeeId: number,
    payload: UpsertEmployeeContactDto
  ): Promise<EmployeeContact> => {
    const { data } = await apiClient.post<BackendResponse<EmployeeContact>>(
      `/panel/companies/${companyId}/employees/${employeeId}/contact`,
      payload
    );
    return data.data;
  },
};
