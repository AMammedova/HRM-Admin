import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Button } from '@/shared/atoms/Button';
import { CompanyDetailContainer } from '@/features/companies/containers/CompanyDetailContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'companies' });

  return {
    title: `${t('companyDetails')} - HRM Admin`,
  };
}

export default async function CompanyDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'companies' });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('companyDetails')}
        action={
          <Link href={`/${locale}/companies`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToList')}
            </Button>
          </Link>
        }
      />
      <CompanyDetailContainer companyId={Number(id)} locale={locale} />
    </div>
  );
}
