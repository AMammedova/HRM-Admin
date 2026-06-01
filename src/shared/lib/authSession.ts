import type { LoginResponseData } from '@/features/auth/types/auth.types';

const PENDING_LOGIN_KEY = 'hrm_pending_login';

const isBrowser = typeof window !== 'undefined';

export const authSession = {
  setPendingLogin: (data: LoginResponseData): void => {
    if (!isBrowser) return;
    sessionStorage.setItem(PENDING_LOGIN_KEY, JSON.stringify(data));
  },

  getPendingLogin: (): LoginResponseData | null => {
    if (!isBrowser) return null;
    const raw = sessionStorage.getItem(PENDING_LOGIN_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LoginResponseData;
    } catch {
      return null;
    }
  },

  getPendingAccessToken: (): string | null => {
    return authSession.getPendingLogin()?.token.token ?? null;
  },

  clearPendingLogin: (): void => {
    if (!isBrowser) return;
    sessionStorage.removeItem(PENDING_LOGIN_KEY);
  },
};
