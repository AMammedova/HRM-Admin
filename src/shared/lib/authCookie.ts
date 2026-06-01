const AUTH_COOKIE_NAME = 'hrm_auth';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const isBrowser = typeof window !== 'undefined';

export const authCookie = {
  set: (): void => {
    if (!isBrowser) return;
    document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
  },

  clear: (): void => {
    if (!isBrowser) return;
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  },
};

export const AUTH_COOKIE_NAME_EXPORT = AUTH_COOKIE_NAME;
