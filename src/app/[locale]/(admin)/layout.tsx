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
      label: t('companies'),
      icon: 'Building2' as const,
      children: [
        {
          label: t('companyList'),
          href: `/${locale}/companies`,
        },
        {
          label: t('companyTypes'),
          href: `/${locale}/companies/company-types`,
          icon: 'Tags' as const,
        },
        {
          label: t('companySettings'),
          href: `/${locale}/companies/settings`,
          icon: 'Settings' as const,
        },
        {
          label: t('companySignatures'),
          href: `/${locale}/companies/signatures`,
          icon: 'PenLine' as const,
        },
        {
          label: t('companyPdfSignatures'),
          href: `/${locale}/companies/pdf-signatures`,
          icon: 'FileSignature' as const,
        },
        {
          label: t('companyPhones'),
          href: `/${locale}/companies/phones`,
          icon: 'Phone' as const,
        },
        {
          label: t('banks'),
          href: `/${locale}/banks`,
          icon: 'Landmark' as const,
        },
        {
          label: t('branches'),
          href: `/${locale}/branches`,
          icon: 'MapPin' as const,
        },
        {
          label: t('positions'),
          href: `/${locale}/positions`,
          icon: 'Briefcase' as const,
        },
        {
          label: t('orgChartLines'),
          href: `/${locale}/org-chart-lines`,
          icon: 'Network' as const,
        },
        {
          label: t('orgChartLevels'),
          href: `/${locale}/org-chart-levels`,
          icon: 'Layers' as const,
        },
        {
          label: t('businessTravelSettings'),
          href: `/${locale}/business-travel-settings`,
          icon: 'Plane' as const,
        },
        {
          label: t('overtimeSettings'),
          href: `/${locale}/overtime-settings`,
          icon: 'Clock' as const,
        },
      ],
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
    <AuthGuard>
      <div className="relative min-h-screen">
        <NavbarWrapper currentLocale={locale} />
        <SidebarWrapper items={sidebarItems}>{children}</SidebarWrapper>
      </div>
    </AuthGuard>
  );
}
