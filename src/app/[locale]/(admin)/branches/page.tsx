import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { BranchesContainer } from '@/features/companies/containers/BranchesContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'branches' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function BranchesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'branches' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />
      <BranchesContainer locale={locale} />
    </div>
  );
}
