const ACCESS_TOKEN_KEY = 'hrm_access_token';
const REFRESH_TOKEN_KEY = 'hrm_refresh_token';

const isBrowser = typeof window !== 'undefined';

export const tokenStorage = {
  getToken: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setToken: (token: string): void => {
    if (!isBrowser) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    if (!isBrowser) return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    tokenStorage.setToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);
  },

  clear: (): void => {
    if (!isBrowser) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
