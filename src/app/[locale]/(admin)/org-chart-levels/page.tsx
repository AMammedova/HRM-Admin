import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { OrgChartLevelsContainer } from '@/features/companies/containers/OrgChartLevelsContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'orgChartLevels' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function OrgChartLevelsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'orgChartLevels' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />
      <OrgChartLevelsContainer locale={locale} />
    </div>
  );
}
