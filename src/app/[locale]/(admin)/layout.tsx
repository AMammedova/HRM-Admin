import * as React from 'react';
import { getTranslations } from 'next-intl/server';
import { NavbarWrapper } from '@/shared/organisms/NavbarWrapper';
import { SidebarWrapper } from '@/shared/organisms/SidebarWrapper';

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'nav' });

  const sidebarItems = [
    { 
      label: t('dashboard'), 
      href: `/${locale}/dashboard`, 
      icon: 'LayoutDashboard' as const
    },
    { 
      label: t('users'), 
      href: `/${locale}/users`, 
      icon: 'Users' as const
    },
    { 
      label: t('employees'), 
      href: `/${locale}/employees`, 
      icon: 'UserCircle' as const
    },
    { 
      label: t('contracts'), 
      href: `/${locale}/contracts`, 
      icon: 'FileText' as const
    },
    {
      label: t('orders'), 
      href: `/${locale}/orders`, 
      icon: 'ClipboardList' as const
    },
    {
      label: t('explanations'),
      href: `/${locale}/explanations`,
      icon: 'FileCheck' as const
    },
    { 
      label: t('announcements'), 
      href: `/${locale}/announcements`, 
      icon: 'Megaphone' as const
    },
    { 
      label: t('structure'), 
      href: `/${locale}/structure`, 
      icon: 'Building' as const
    },
    { 
      label: t('attendance'), 
      href: `/${locale}/attendance`, 
      icon: 'Calendar' as const
    },
  ];

  return (
    <div className="relative min-h-screen">
      <NavbarWrapper currentLocale={locale} />
      <SidebarWrapper items={sidebarItems}>
        {children}
      </SidebarWrapper>
    </div>
  );
}