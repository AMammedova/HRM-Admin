import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Button } from '@/shared/atoms/Button';
import { BranchDetailContainer } from '@/features/companies/containers/BranchDetailContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'branches' });

  return {
    title: `${t('branchDetails')} - HRM Admin`,
  };
}

export default async function BranchDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'branches' });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('branchDetails')}
        action={
          <Link href={`/${locale}/branches`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToList')}
            </Button>
          </Link>
        }
      />
      <BranchDetailContainer branchId={Number(id)} locale={locale} />
    </div>
  );
}
