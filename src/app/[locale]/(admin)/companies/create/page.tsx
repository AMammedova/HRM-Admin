import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Card, CardContent } from '@/shared/atoms/Card';
import { CompanyFormContainer } from '@/features/companies/containers/CompanyFormContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'companies' });

  return {
    title: `${t('createCompany')} - HRM Admin`,
  };
}

export default async function CreateCompanyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'companies' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('createCompany')} />
      <Card>
        <CardContent className="pt-6">
          <CompanyFormContainer locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}
