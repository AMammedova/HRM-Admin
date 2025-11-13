import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Breadcrumb } from '@/shared/molecules/Breadcrumb';
import { AttendanceContainer } from '@/features/attendance/containers/AttendanceContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'attendance' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function AttendancePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'attendance' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const breadcrumbItems = [
    { label: tNav('dashboard'), href: `/${locale}/dashboard` },
    { label: t('title'), href: `/${locale}/attendance` },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader title={t('title')} />
      </div>
      <AttendanceContainer locale={locale} />
    </div>
  );
}

