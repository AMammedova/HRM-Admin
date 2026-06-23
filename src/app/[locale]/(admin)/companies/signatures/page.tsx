import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { CompanySignaturesContainer } from '@/features/companies/containers/CompanySignaturesContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'companySignatures' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function CompanySignaturesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'companySignatures' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />
      <CompanySignaturesContainer locale={locale} />
    </div>
  );
}
