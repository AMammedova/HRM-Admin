import * as React from 'react';
import { getTranslations } from 'next-intl/server';
import { AuthGuard } from '@/shared/components/AuthGuard';
import { NavbarWrapper } from '@/shared/organisms/NavbarWrapper';
import { SidebarWrapper } from '@/shared/organisms/SidebarWrapper';
import { PERMISSIONS } from '@/shared/types/permissions';

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
      icon: 'LayoutDashboard' as const,
      // Dashboard is always visible (no permission required)
    },
    {
      label: t('users'),
      href: `/${locale}/users`,
      icon: 'Users' as const,
      permission: PERMISSIONS.USERS.VIEW,
    },
    {
      label: t('employees'),
      href: `/${locale}/employees`,
      icon: 'UserCircle' as const,
      permission: PERMISSIONS.EMPLOYEES.VIEW,
    },
    {
      label: t('contracts'),
      href: `/${locale}/contracts`,
      icon: 'FileText' as const,
      permission: PERMISSIONS.CONTRACTS.VIEW,
    },
    {
      label: t('orders'),
      href: `/${locale}/orders`,
      icon: 'ClipboardList' as const,
      permission: PERMISSIONS.ORDERS.VIEW,
    },
    {
      label: t('explanations'),
      href: `/${locale}/explanations`,
      icon: 'FileCheck' as const,
      permission: PERMISSIONS.EXPLANATIONS.VIEW,
    },
    {
      label: t('announcements'),
      href: `/${locale}/announcements`,
      icon: 'Megaphone' as const,
      permission: PERMISSIONS.ANNOUNCEMENTS.VIEW,
    },
    {
      label: t('structure'),
      href: `/${locale}/structure`,
      icon: 'Building' as const,
      permission: PERMISSIONS.STRUCTURE.VIEW,
    },
    {
      label: t('attendance'),
      href: `/${locale}/attendance`,
      icon: 'Calendar' as const,
      permission: PERMISSIONS.ATTENDANCE.VIEW,
    },
  ];

  return (
    <AuthGuard locale={locale}>
      <div className="relative min-h-screen">
        <NavbarWrapper currentLocale={locale} />
        <SidebarWrapper items={sidebarItems}>{children}</SidebarWrapper>
      </div>
    </AuthGuard>
  );
}
