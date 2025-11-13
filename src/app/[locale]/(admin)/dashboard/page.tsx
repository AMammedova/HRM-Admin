import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { DashboardContainer } from '@/features/dashboard/containers/DashboardContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function DashboardPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('overview')} />
      <DashboardContainer locale={locale} />
    </div>
  );
}

