import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Card, CardContent } from '@/shared/atoms/Card';
import { ContractForm } from '@/features/contracts/components/ContractForm';
import { Breadcrumb } from '@/shared/molecules/Breadcrumb';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'contracts' });

  return {
    title: `${t('createContractTitle')} - HRM Admin`,
  };
}

export default async function CreateContractPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'contracts' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const breadcrumbItems = [
    { label: tNav('dashboard'), href: `/${locale}/dashboard` },
    { label: t('title'), href: `/${locale}/contracts` },
    { label: t('createContractTitle'), href: `/${locale}/contracts/create` },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader title={t('createContractTitle')} />
      </div>
      <Card>
        <CardContent className="pt-6">
          <ContractForm />
        </CardContent>
      </Card>
    </div>
  );
}


