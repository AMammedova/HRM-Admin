import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Button } from '@/shared/atoms/Button';
import { CompanyTypesContainer } from '@/features/companies/containers/CompanyTypesContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'companyTypes' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function CompanyTypesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'companyTypes' });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        action={
          <Link href={`/${locale}/companies/company-types/create`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('createCompanyType')}
            </Button>
          </Link>
        }
      />
      <CompanyTypesContainer locale={locale} />
    </div>
  );
}
