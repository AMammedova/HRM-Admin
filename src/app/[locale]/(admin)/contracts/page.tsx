import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/shared/molecules/Breadcrumb';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { ContractsContainer } from '@/features/contracts/containers/ContractsContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'contracts' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function ContractsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'contracts' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const breadcrumbItems = [
    { label: tNav('dashboard'), href: `/${locale}/dashboard` },
    { label: t('title'), href: `/${locale}/contracts` },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader title={t('title')} />
      </div>
      <ContractsContainer locale={locale} />
    </div>
  );
}


