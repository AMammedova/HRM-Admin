import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Button } from '@/shared/atoms/Button';
import { BankDetailContainer } from '@/features/companies/containers/BankDetailContainer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'banks' });

  return {
    title: `${t('bankDetails')} - HRM Admin`,
  };
}

export default async function BankDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'banks' });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('bankDetails')}
        action={
          <Link href={`/${locale}/banks`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToList')}
            </Button>
          </Link>
        }
      />
      <BankDetailContainer bankId={Number(id)} locale={locale} />
    </div>
  );
}
