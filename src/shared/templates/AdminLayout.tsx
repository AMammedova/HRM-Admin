'use client';

import * as React from 'react';
import { AppShell, AppShellProps } from '@/shared/organisms/AppShell';

export interface AdminLayoutProps extends AppShellProps {}

export function AdminLayout(props: AdminLayoutProps) {
  return <AppShell {...props} />;
}

