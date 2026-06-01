import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { authCookie } from '@/shared/lib/authCookie';
import { authSession } from '@/shared/lib/authSession';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import type { SelectCompanyResponseData } from '../types/auth.types';

export function useSelectCompany() {
  return useMutation<SelectCompanyResponseData, Error, number>({
    mutationFn: async (companyId) => {
      const pending = authSession.getPendingLogin();
      if (!pending) {
        throw new Error('No pending login session');
      }

      return authApi.selectCompany({
        userId: pending.userId,
        companyId,
      });
    },
    onSuccess: (tokenData) => {
      tokenStorage.setTokens(tokenData.token, tokenData.refreshToken);
      authCookie.set();
      authSession.clearPendingLogin();
    },
  });
}
