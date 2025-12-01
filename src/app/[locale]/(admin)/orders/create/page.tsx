import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Card, CardContent } from '@/shared/atoms/Card';
import { OrderForm } from '@/features/orders/components/OrderForm';
import { Breadcrumb } from '@/shared/molecules/Breadcrumb';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'orders' });

  return {
    title: `${t('createOrderTitle')} - HRM Admin`,
  };
}

export default async function CreateOrderPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'orders' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const breadcrumbItems = [
    { label: tNav('dashboard'), href: `/${locale}/dashboard` },
    { label: t('title'), href: `/${locale}/orders` },
    { label: t('createOrderTitle'), href: `/${locale}/orders/create` },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader title={t('createOrderTitle')} />
      </div>
      <Card>
        <CardContent className="pt-6">
          <OrderForm />
        </CardContent>
      </Card>
    </div>
  );
}


