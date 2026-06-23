import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { CompanyPhonesContainer } from '@/features/companies/containers/CompanyPhonesContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'companyPhones' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function CompanyPhonesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'companyPhones' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />
      <CompanyPhonesContainer locale={locale} />
    </div>
  );
}
