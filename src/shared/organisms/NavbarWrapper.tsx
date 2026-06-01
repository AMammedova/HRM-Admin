'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { useTranslations } from 'next-intl';
import { authCookie } from '@/shared/lib/authCookie';
import { authSession } from '@/shared/lib/authSession';
import { tokenStorage } from '@/shared/lib/tokenStorage';

export interface NavbarWrapperProps {
  currentLocale: string;
}

export function NavbarWrapper({ currentLocale }: NavbarWrapperProps) {
  const router = useRouter();
  const tCommon = useTranslations('common');

  const handleSignOut = async () => {
    tokenStorage.clear();
    authSession.clearPendingLogin();
    authCookie.clear();
    router.push(`/${currentLocale}/sign-in`);
  };

  const handleLocaleChange = () => {
    // Handled by Navbar component
  };

  return (
    <Navbar
      appName={tCommon('appName')}
      currentLocale={currentLocale}
      onLocaleChange={handleLocaleChange}
      onSignOut={handleSignOut}
      userName="Demo User"
    />
  );
}

