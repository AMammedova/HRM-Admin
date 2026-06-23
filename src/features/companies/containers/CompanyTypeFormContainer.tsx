'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { companyTypesApi } from '../api/company-types.api';
import { CompanyTypeForm } from '../presenters/CompanyTypeForm';
import { CompanyTypeFormData } from '@/validators/company-type.schema';
import { useToast } from '@/shared/hooks/useToast';

export interface CompanyTypeFormContainerProps {
  companyTypeId?: number;
  locale: string;
}

export function CompanyTypeFormContainer({
  companyTypeId,
  locale,
}: CompanyTypeFormContainerProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('companyTypes');
  const tCommon = useTranslations('common');

  const { data: companyType, isLoading: isLoadingCompanyType } = useQuery({
    queryKey: ['company-type', companyTypeId],
    queryFn: () => companyTypesApi.getById(companyTypeId!),
    enabled: !!companyTypeId,
  });

  const createMutation = useMutation({
    mutationFn: companyTypesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-types'] });
      queryClient.invalidateQueries({ queryKey: ['company-types-all'] });
      toast({ title: t('createSuccess'), variant: 'default' });
      router.push(`/${locale}/companies/company-types`);
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
    mutationFn: (data: CompanyTypeFormData) =>
      companyTypesApi.update(companyTypeId!, {
        id: companyTypeId!,
        code: data.code,
        sortOrder: data.sortOrder ?? companyType?.sortOrder ?? 0,
        translations: data.translations,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-types'] });
      queryClient.invalidateQueries({ queryKey: ['company-types-all'] });
      queryClient.invalidateQueries({ queryKey: ['company-type', companyTypeId] });
      toast({ title: t('updateSuccess'), variant: 'default' });
      router.push(`/${locale}/companies/company-types`);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('updateError'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: CompanyTypeFormData) => {
    if (companyTypeId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate({
        code: data.code,
        translations: data.translations,
      });
    }
  };

  const handleCancel = () => {
    router.push(`/${locale}/companies/company-types`);
  };

  if (companyTypeId && isLoadingCompanyType) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">{tCommon('loading')}</p>
      </div>
    );
  }

  return (
    <CompanyTypeForm
      initialData={companyType}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={createMutation.isPending || updateMutation.isPending}
    />
  );
}
