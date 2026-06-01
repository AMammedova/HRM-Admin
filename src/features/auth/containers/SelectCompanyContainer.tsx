'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SelectCompanyForm } from '../presenters/SelectCompanyForm';
import { useSelectCompany } from '../hooks/useSelectCompany';
import { authSession } from '@/shared/lib/authSession';
import { useToast } from '@/shared/hooks/useToast';

export interface SelectCompanyContainerProps {
  locale: string;
}

export function SelectCompanyContainer({ locale }: SelectCompanyContainerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('auth');

  const [pending] = React.useState(() => authSession.getPendingLogin());

  React.useEffect(() => {
    if (!pending) {
      router.replace(`/${locale}/sign-in`);
    }
  }, [pending, locale, router]);

  const { mutate: selectCompany, isPending, error } = useSelectCompany();

  const handleSubmit = (companyId: number) => {
    selectCompany(companyId, {
      onSuccess: () => {
        toast({ title: t('companySelectedSuccess'), variant: 'default' });
        router.push(`/${locale}/dashboard`);
      },
      onError: (err) => {
        toast({
          title: t('companySelectedError'),
          description: err.message,
          variant: 'destructive',
        });
      },
    });
  };

  if (!pending) {
    return null;
  }

  return (
    <SelectCompanyForm
      companies={pending.companies}
      onSubmit={handleSubmit}
      loading={isPending}
      error={error?.message ?? ''}
    />
  );
}
