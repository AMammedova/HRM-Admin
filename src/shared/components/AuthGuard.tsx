'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import { permissionStorage } from '@/shared/lib/permissionStorage';
import { PermissionsProvider } from '@/shared/context/PermissionsContext';
import { authApi } from '@/features/auth/api/auth.api';

export interface AuthGuardProps {
  locale: string;
  children: React.ReactNode;
}

export function AuthGuard({ locale, children }: AuthGuardProps) {
  const router = useRouter();
  const [ready, setReady] = React.useState(false);

  // Initialise from cache so sidebar renders instantly on refresh
  const [permissions, setPermissions] = React.useState<string[]>(() =>
    permissionStorage.getPermissions()
  );

  React.useEffect(() => {
    if (!tokenStorage.getToken()) {
      router.replace(`/${locale}/sign-in`);
      return;
    }

    setReady(true);

    // Refresh permissions from the API in the background
    authApi
      .getMyPermissions()
      .then((fresh) => {
        setPermissions(fresh);
        permissionStorage.setPermissions(fresh);
      })
      .catch(() => {
        // Keep cached permissions on network errors; axios interceptor
        // handles 401 → token refresh or redirect to sign-in
      });
  }, [locale, router]);

  if (!ready) {
    return null;
  }

  return <PermissionsProvider permissions={permissions}>{children}</PermissionsProvider>;
}
