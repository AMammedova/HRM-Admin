import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { PositionsContainer } from '@/features/companies/containers/PositionsContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'positions' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function PositionsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'positions' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />
      <PositionsContainer locale={locale} />
    </div>
  );
}
