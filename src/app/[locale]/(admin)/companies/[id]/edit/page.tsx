import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Card, CardContent } from '@/shared/atoms/Card';
import { CompanyFormContainer } from '@/features/companies/containers/CompanyFormContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'companies' });

  return {
    title: `${t('editCompany')} - HRM Admin`,
  };
}

export default async function EditCompanyPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'companies' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('editCompany')} />
      <Card>
        <CardContent className="pt-6">
          <CompanyFormContainer companyId={Number(id)} locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}
