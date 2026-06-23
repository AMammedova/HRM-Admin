import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { CompanyPdfSignaturesContainer } from '@/features/companies/containers/CompanyPdfSignaturesContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'companyPdfSignatures' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function CompanyPdfSignaturesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'companyPdfSignatures' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />
      <CompanyPdfSignaturesContainer locale={locale} />
    </div>
  );
}
