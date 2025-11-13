import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Button } from '@/shared/atoms/Button';
import { UsersContainer } from '@/features/users/containers/UsersContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'users' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function UsersPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'users' });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        action={
          <Link href={`/${locale}/users/create`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('createUser')}
            </Button>
          </Link>
        }
      />
      <UsersContainer locale={locale} />
    </div>
  );
}

