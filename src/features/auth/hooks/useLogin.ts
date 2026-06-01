import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { authCookie } from '@/shared/lib/authCookie';
import { authSession } from '@/shared/lib/authSession';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import type { LoginRequest, LoginResponseData } from '../types/auth.types';

function persistAuthTokens(token: LoginResponseData['token']): void {
  tokenStorage.setTokens(token.token, token.refreshToken);
  authCookie.set();
}

export function useLogin() {
  return useMutation<LoginResponseData, Error, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.requiresCompanySelection) {
        authSession.setPendingLogin(data);
        tokenStorage.clear();
        authCookie.clear();
        return;
      }

      authSession.clearPendingLogin();
      persistAuthTokens(data.token);
    },
  });
}
