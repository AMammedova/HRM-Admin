import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Card, CardContent } from '@/shared/atoms/Card';
import { UserFormContainer } from '@/features/users/containers/UserFormContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'users' });

  return {
    title: `${t('editUser')} - HRM Admin`,
  };
}

export default async function EditUserPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'users' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('editUser')} />
      <Card>
        <CardContent className="pt-6">
          <UserFormContainer userId={id} locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}

