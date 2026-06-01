import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type {
  ForgotPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponseData,
  ResetPasswordRequest,
} from '../types/auth.types';

export function useForgotPassword() {
  return useMutation<void, Error, ForgotPasswordRequest>({
    mutationFn: authApi.forgotPassword,
  });
}

export function useVerifyOtp() {
  return useMutation<VerifyOtpResponseData, Error, VerifyOtpRequest>({
    mutationFn: authApi.verifyOtp,
  });
}

export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordRequest>({
    mutationFn: authApi.resetPassword,
  });
}
