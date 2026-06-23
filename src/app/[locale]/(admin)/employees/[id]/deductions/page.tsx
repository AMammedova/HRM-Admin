import { getTranslations } from 'next-intl/server';
import { EmployeeDeductionsContainer } from '@/features/employees/containers/EmployeeDeductionsContainer';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'employeeDeductions' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default function EmployeeDeductionsPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  return <EmployeeDeductionsContainer employeeId={Number(id)} locale={locale} />;
}
