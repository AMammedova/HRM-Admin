import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { BanksContainer } from '@/features/companies/containers/BanksContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'banks' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function BanksPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'banks' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />
      <BanksContainer locale={locale} />
    </div>
  );
}
