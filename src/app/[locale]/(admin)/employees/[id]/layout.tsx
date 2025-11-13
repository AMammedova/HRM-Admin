import { getTranslations } from 'next-intl/server';
import { mockEmployees } from '@/features/employees/data/mock-employees';
import { ReactNode } from 'react';

export async function generateMetadata({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'employees' });
  const employee = mockEmployees.find((emp) => emp.id === id);

  return {
    title: employee
      ? `${employee.firstName} ${employee.lastName} - ${t('employeeCard')}`
      : `${t('employeeCard')} - HRM Admin`,
  };
}

export default function EmployeeDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
