import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Button } from '@/shared/atoms/Button';
import { BranchWorkingHoursContainer } from '@/features/companies/containers/BranchWorkingHoursContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'branchWorkingHours' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default async function BranchWorkingHoursPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'branchWorkingHours' });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('description')}
        action={
          <Link href={`/${locale}/branches/${id}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToBranch')}
            </Button>
          </Link>
        }
      />
      <BranchWorkingHoursContainer branchId={Number(id)} locale={locale} />
    </div>
  );
}
