'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumb } from '@/shared/molecules/Breadcrumb';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Button } from '@/shared/atoms/Button';
import { employeeContactApi } from '../api/employee-contact.api';
import { employeesApi } from '../api/employees.api';
import { EmployeeContactForm } from '../presenters/EmployeeContactForm';
import { getEmployeeTranslation } from '../types/employee.types';
import { EmployeeContactFormData } from '@/validators/employee-contact.schema';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { useToast } from '@/shared/hooks/useToast';

export interface EmployeeContactContainerProps {
  employeeId: number;
  locale: string;
}

export function EmployeeContactContainer({ employeeId, locale }: EmployeeContactContainerProps) {
  const companyId = useCompanyId();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('employees');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const { data: employee } = useQuery({
    queryKey: ['company-employee', companyId, employeeId],
    queryFn: () => employeesApi.getById(companyId!, employeeId),
    enabled: !!companyId && !!employeeId,
  });

  const {
    data: contact,
    isLoading: isLoadingContact,
    isError: isContactError,
  } = useQuery({
    queryKey: ['employee-contact', companyId, employeeId],
    queryFn: () => employeeContactApi.get(companyId!, employeeId),
    enabled: !!companyId && !!employeeId,
  });

  const saveMutation = useMutation({
    mutationFn: (payload: EmployeeContactFormData) =>
      employeeContactApi.upsert(companyId!, employeeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-contact', companyId, employeeId] });
      toast({ title: t('contactSaveSuccess'), variant: 'default' });
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('contactSaveError'),
        variant: 'destructive',
      });
    },
  });

  const translation = employee
    ? getEmployeeTranslation(employee.translations, locale)
    : undefined;

  const fullName = translation
    ? `${translation.surname} ${translation.name}`.trim()
    : '';

  const breadcrumbItems = [
    { label: tNav('dashboard'), href: `/${locale}/dashboard` },
    { label: tNav('employees'), href: `/${locale}/employees` },
    { label: fullName || t('employeeDetails'), href: `/${locale}/employees/${employeeId}` },
    { label: t('contactInfo') },
  ];

  const handleSubmit = (data: EmployeeContactFormData) => {
    saveMutation.mutate(data);
  };

  if (!companyId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {tCommon('noCompanyInSession')}
      </div>
    );
  }

  if (isContactError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center text-destructive">
        {t('contactLoadError')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader
          title={t('contactInfo')}
          description={fullName || undefined}
          action={
            <Link href={`/${locale}/employees`}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {tCommon('back')}
              </Button>
            </Link>
          }
        />
      </div>

      <EmployeeContactForm
        companyId={companyId}
        employeeId={employeeId}
        initialData={contact}
        onSubmit={handleSubmit}
        loading={saveMutation.isPending}
        loadingContact={isLoadingContact}
      />
    </div>
  );
}
