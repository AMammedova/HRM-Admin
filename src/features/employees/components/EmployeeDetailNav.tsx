'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';

export interface EmployeeDetailNavProps {
  locale: string;
  employeeId: number;
}

export function EmployeeDetailNav({ locale, employeeId }: EmployeeDetailNavProps) {
  const pathname = usePathname();
  const t = useTranslations('employees');

  const basePath = `/${locale}/employees/${employeeId}`;
  const items = [
    { label: t('employeeCard'), href: basePath },
    { label: t('contactInfo'), href: `${basePath}/contact` },
    { label: t('deductions'), href: `${basePath}/deductions` },
    { label: t('documents'), href: `${basePath}/documents` },
    { label: t('education'), href: `${basePath}/educations` },
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto border-b">
      {items.map((item) => {
        const isActive =
          item.href === basePath
            ? pathname === basePath
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              isActive
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
