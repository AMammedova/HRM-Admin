import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/shared/molecules/Breadcrumb';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { ExplanationsContainer } from '@/features/explanations/containers/ExplanationsContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'explanations' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function ExplanationsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'explanations' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const breadcrumbItems = [
    { label: tNav('dashboard'), href: `/${locale}/dashboard` },
    { label: t('title'), href: `/${locale}/explanations` },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader title={t('title')} />
      </div>
      <ExplanationsContainer locale={locale} />
    </div>
  );
}


