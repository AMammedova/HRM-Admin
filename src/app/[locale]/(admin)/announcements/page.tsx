import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/shared/molecules/Breadcrumb';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { AnnouncementsContainer } from '@/features/announcements/containers/AnnouncementsContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'announcements' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function AnnouncementsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'announcements' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const breadcrumbItems = [
    { label: tNav('dashboard'), href: `/${locale}/dashboard` },
    { label: t('title'), href: `/${locale}/announcements` },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader title={t('title')} />
      </div>
      <AnnouncementsContainer locale={locale} />
    </div>
  );
}


