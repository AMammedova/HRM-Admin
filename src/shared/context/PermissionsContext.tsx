'use client';

import * as React from 'react';
import type { Permission } from '@/shared/types/permissions';

interface PermissionsContextValue {
  permissions: string[];
  hasPermission: (permission: Permission | string) => boolean;
  hasAnyPermission: (permissions: (Permission | string)[]) => boolean;
  hasAllPermissions: (permissions: (Permission | string)[]) => boolean;
}

const PermissionsContext = React.createContext<PermissionsContextValue>({
  permissions: [],
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
});

export interface PermissionsProviderProps {
  permissions: string[];
  children: React.ReactNode;
}

export function PermissionsProvider({ permissions, children }: PermissionsProviderProps) {
  const value = React.useMemo<PermissionsContextValue>(
    () => ({
      permissions,
      hasPermission: (perm) => permissions.includes(perm),
      hasAnyPermission: (perms) => perms.some((p) => permissions.includes(p)),
      hasAllPermissions: (perms) => perms.every((p) => permissions.includes(p)),
    }),
    [permissions]
  );

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
}

export function usePermissionsContext(): PermissionsContextValue {
  return React.useContext(PermissionsContext);
}
