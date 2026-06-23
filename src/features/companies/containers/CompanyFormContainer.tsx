'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { companiesApi } from '../api/companies.api';
import { CompanyForm } from '../presenters/CompanyForm';
import { CompanyFormData } from '@/validators/company.schema';
import { useToast } from '@/shared/hooks/useToast';

export interface CompanyFormContainerProps {
  companyId?: number;
  locale: string;
}

export function CompanyFormContainer({ companyId, locale }: CompanyFormContainerProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('companies');
  const tCommon = useTranslations('common');

  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => companiesApi.getById(companyId!),
    enabled: !!companyId,
  });

  const createMutation = useMutation({
    mutationFn: companiesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({ title: t('createSuccess'), variant: 'default' });
      router.push(`/${locale}/companies`);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('createError'),
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CompanyFormData) =>
      companiesApi.update(companyId!, { ...data, id: companyId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', companyId] });
      toast({ title: t('updateSuccess'), variant: 'default' });
      router.push(`/${locale}/companies`);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('updateError'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: CompanyFormData) => {
    if (companyId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCancel = () => {
    router.push(`/${locale}/companies`);
  };

  if (companyId && isLoadingCompany) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">{tCommon('loading')}</p>
      </div>
    );
  }

  return (
    <CompanyForm
      initialData={company}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={createMutation.isPending || updateMutation.isPending}
    />
  );
}
