import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { OrgChartLinesContainer } from '@/features/companies/containers/OrgChartLinesContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'orgChartLines' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function OrgChartLinesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'orgChartLines' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />
      <OrgChartLinesContainer locale={locale} />
    </div>
  );
}
