import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import type { RefreshTokenRequest, RefreshTokenResponseData } from '../types/auth.types';

export function useRefreshToken() {
  return useMutation<RefreshTokenResponseData, Error, RefreshTokenRequest>({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      tokenStorage.setToken(data.token);
      tokenStorage.setRefreshToken(data.refreshToken);
    },
  });
}
