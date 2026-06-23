'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { companySettingsApi } from '../api/company-settings.api';
import { CompanySettingsForm } from '../presenters/CompanySettingsForm';
import { CompanySettingsFormData } from '@/validators/company-settings.schema';
import { useToast } from '@/shared/hooks/useToast';
import { useCompanyId } from '@/shared/hooks/useCompanyId';

export interface CompanySettingsContainerProps {
  locale: string;
}

export function CompanySettingsContainer({ locale: _locale }: CompanySettingsContainerProps) {
  const companyId = useCompanyId();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('companySettings');
  const tCommon = useTranslations('common');

  const {
    data: settings,
    isLoading: isLoadingSettings,
    isError: isSettingsError,
  } = useQuery({
    queryKey: ['company-settings', companyId],
    queryFn: () => companySettingsApi.getByCompanyId(companyId!),
    enabled: !!companyId,
  });

  const saveMutation = useMutation({
    mutationFn: companySettingsApi.upsert,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company-settings', variables.companyId] });
      toast({ title: t('saveSuccess'), variant: 'default' });
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('saveError'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: CompanySettingsFormData) => {
    saveMutation.mutate(data);
  };

  if (!companyId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {tCommon('noCompanyInSession')}
      </div>
    );
  }

  if (isSettingsError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {t('loadError')}
      </div>
    );
  }

  return (
    <CompanySettingsForm
      companyId={companyId}
      initialData={settings}
      onSubmit={handleSubmit}
      loading={saveMutation.isPending}
      loadingSettings={isLoadingSettings}
    />
  );
}
