import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { CompanySettingsContainer } from '@/features/companies/containers/CompanySettingsContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'companySettings' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function CompanySettingsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'companySettings' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />
      <CompanySettingsContainer locale={locale} />
    </div>
  );
}
