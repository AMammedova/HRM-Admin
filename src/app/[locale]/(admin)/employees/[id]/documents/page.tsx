import { getTranslations } from 'next-intl/server';
import { EmployeeDocumentsContainer } from '@/features/employees/containers/EmployeeDocumentsContainer';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'employeeDocuments' });

  return {
    title: `${t('title')} - HRM Admin`,
  };
}

export default function EmployeeDocumentsPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  return <EmployeeDocumentsContainer employeeId={Number(id)} locale={locale} />;
}
