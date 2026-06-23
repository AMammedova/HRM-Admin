import { getTranslations } from 'next-intl/server';
import { EmployeeEducationsContainer } from '@/features/employees/containers/EmployeeEducationsContainer';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'employeeEducations' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default function EmployeeEducationsPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  return <EmployeeEducationsContainer employeeId={Number(id)} locale={locale} />;
}
