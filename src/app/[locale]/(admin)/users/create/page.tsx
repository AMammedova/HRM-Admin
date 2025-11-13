import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Card, CardContent } from '@/shared/atoms/Card';
import { UserFormContainer } from '@/features/users/containers/UserFormContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'users' });

  return {
    title: `${t('createUser')} - HRM Admin`,
  };
}

export default async function CreateUserPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'users' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('createUser')} />
      <Card>
        <CardContent className="pt-6">
          <UserFormContainer locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}

