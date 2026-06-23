import axios from 'axios';
import apiClient from '@/shared/lib/axios';
import type { BackendResponse } from '@/shared/types/api';
import type {
  CompanySettings,
  UpsertCompanySettingsDto,
} from '../types/company-settings.types';
import { defaultCompanySettings as getDefaults } from '../types/company-settings.types';

export const companySettingsApi = {
  getByCompanyId: async (companyId: number): Promise<CompanySettings> => {
    try {
      const { data } = await apiClient.get<BackendResponse<CompanySettings>>(
        `/panel/company-settings/${companyId}`
      );
      return data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return getDefaults(companyId);
      }
      throw error;
    }
  },

  upsert: async (payload: UpsertCompanySettingsDto): Promise<CompanySettings> => {
    const { data } = await apiClient.post<BackendResponse<CompanySettings>>(
      '/panel/company-settings',
      payload
    );
    return data.data;
  },
};
