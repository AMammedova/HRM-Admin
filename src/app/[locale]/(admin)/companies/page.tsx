import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Button } from '@/shared/atoms/Button';
import { CompaniesContainer } from '@/features/companies/containers/CompaniesContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'companies' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function CompaniesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'companies' });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        action={
          <Link href={`/${locale}/companies/create`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('createCompany')}
            </Button>
          </Link>
        }
      />
      <CompaniesContainer locale={locale} />
    </div>
  );
}
