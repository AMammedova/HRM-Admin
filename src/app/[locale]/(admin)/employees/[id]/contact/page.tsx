import { getTranslations } from 'next-intl/server';
import { EmployeeContactContainer } from '@/features/employees/containers/EmployeeContactContainer';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'employees' });

  return {
    title: `${t('contactInfo')} - HRM Admin`,
  };
}

export default function EmployeeContactPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  return <EmployeeContactContainer employeeId={Number(id)} locale={locale} />;
}
