import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Card, CardContent } from '@/shared/atoms/Card';
import { Button } from '@/shared/atoms/Button';
import { CompanyTypeFormContainer } from '@/features/companies/containers/CompanyTypeFormContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'companyTypes' });

  return {
    title: `${t('createCompanyType')} - HRM Admin`,
  };
}

export default async function CreateCompanyTypePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'companyTypes' });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('createCompanyType')}
        action={
          <Link href={`/${locale}/companies/company-types`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToList')}
            </Button>
          </Link>
        }
      />
      <Card>
        <CardContent className="pt-6">
          <CompanyTypeFormContainer locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}
