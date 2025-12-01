import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Card, CardContent } from '@/shared/atoms/Card';
import { AnnouncementForm } from '@/features/announcements/components/AnnouncementForm';
import { Breadcrumb } from '@/shared/molecules/Breadcrumb';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'announcements' });

  return {
    title: `${t('createAnnouncementTitle')} - HRM Admin`,
  };
}

export default async function CreateAnnouncementPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'announcements' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const breadcrumbItems = [
    { label: tNav('dashboard'), href: `/${locale}/dashboard` },
    { label: t('title'), href: `/${locale}/announcements` },
    { label: t('createAnnouncementTitle'), href: `/${locale}/announcements/create` },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader title={t('createAnnouncementTitle')} />
      </div>
      <Card>
        <CardContent className="pt-6">
          <AnnouncementForm />
        </CardContent>
      </Card>
    </div>
  );
}


