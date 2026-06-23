import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { BusinessTravelSettingsContainer } from '@/features/business-travel-settings/containers/BusinessTravelSettingsContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'businessTravelSettings' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function BusinessTravelSettingsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'businessTravelSettings' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />
      <BusinessTravelSettingsContainer locale={locale} />
    </div>
  );
}
