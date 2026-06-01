import apiClient from '@/shared/lib/axios';
import type { BackendResponse } from '@/shared/types/api';
import type {
  LoginRequest,
  LoginResponseData,
  RefreshTokenRequest,
  RefreshTokenResponseData,
  SelectCompanyRequest,
  SelectCompanyResponseData,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponseData,
  ResetPasswordRequest,
} from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponseData> => {
    const { data } = await apiClient.post<BackendResponse<LoginResponseData>>(
      '/panel/auth/login',
      credentials
    );
    return data.data;
  },

  refreshToken: async (
    payload: RefreshTokenRequest
  ): Promise<RefreshTokenResponseData> => {
    const { data } = await apiClient.post<BackendResponse<RefreshTokenResponseData>>(
      '/panel/auth/refresh-token',
      payload
    );
    return data.data;
  },

  selectCompany: async (
    payload: SelectCompanyRequest
  ): Promise<SelectCompanyResponseData> => {
    const { data } = await apiClient.post<BackendResponse<SelectCompanyResponseData>>(
      '/panel/auth/select-company',
      payload
    );
    return data.data;
  },

  getMyPermissions: async (): Promise<string[]> => {
    const { data } = await apiClient.get<BackendResponse<string[]>>(
      '/panel/auth/my-permissions'
    );
    return data.data;
  },

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post<BackendResponse<null>>('/panel/auth/forgot-password', payload);
  },

  verifyOtp: async (payload: VerifyOtpRequest): Promise<VerifyOtpResponseData> => {
    const { data } = await apiClient.post<BackendResponse<VerifyOtpResponseData | string>>(
      '/panel/auth/verify-otp',
      payload
    );

    const result = data.data;
    if (typeof result === 'string') {
      return { resetToken: result };
    }
    return result;
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<void> => {
    const { resetToken, newPassword } = payload;
    await apiClient.post<BackendResponse<null>>('/panel/auth/reset-password', {
      resetToken,
      newPassword,
    });
  },
};
