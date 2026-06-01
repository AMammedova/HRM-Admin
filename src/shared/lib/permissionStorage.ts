const PERMISSIONS_KEY = 'hrm_permissions';

const isBrowser = typeof window !== 'undefined';

export const permissionStorage = {
  getPermissions: (): string[] => {
    if (!isBrowser) return [];
    try {
      const raw = localStorage.getItem(PERMISSIONS_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  },

  setPermissions: (permissions: string[]): void => {
    if (!isBrowser) return;
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
  },

  clear: (): void => {
    if (!isBrowser) return;
    localStorage.removeItem(PERMISSIONS_KEY);
  },
};
