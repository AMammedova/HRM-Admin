import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';
import { EmployeeDetailNav } from '@/features/employees/components/EmployeeDetailNav';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'employees' });

  return {
    title: `${t('employeeCard')} - HRM Admin`,
  };
}

export default function EmployeeDetailLayout({
  children,
  params: { locale, id },
}: {
  children: ReactNode;
  params: { locale: string; id: string };
}) {
  return (
    <div className="space-y-6">
      <EmployeeDetailNav locale={locale} employeeId={Number(id)} />
      {children}
    </div>
  );
}
