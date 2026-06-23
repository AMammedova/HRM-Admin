'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Edit } from 'lucide-react';
import { banksApi } from '../api/banks.api';
import { BankDetailView } from '../presenters/BankDetailView';
import { BankFormModal } from '../components/BankFormModal';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { useToast } from '@/shared/hooks/useToast';
import { Button } from '@/shared/atoms/Button';
import { BankFormData } from '@/validators/bank.schema';

export interface BankDetailContainerProps {
  bankId: number;
  locale: string;
}

export function BankDetailContainer({ bankId, locale }: BankDetailContainerProps) {
  const companyId = useCompanyId();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('banks');
  const tCommon = useTranslations('common');
  const [formOpen, setFormOpen] = React.useState(false);

  const { data: bank, isLoading, isError } = useQuery({
    queryKey: ['company-bank', companyId, bankId],
    queryFn: () => banksApi.getById(companyId!, bankId),
    enabled: !!companyId,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: BankFormData) =>
      banksApi.update(companyId!, bankId, { ...payload, id: bankId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-bank', companyId, bankId] });
      queryClient.invalidateQueries({ queryKey: ['company-banks', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-banks-all', companyId] });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('updateError'),
        variant: 'destructive',
      });
    },
  });

  if (!companyId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {tCommon('noCompanyInSession')}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">{tCommon('loading')}</p>
      </div>
    );
  }

  if (isError || !bank) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {t('loadError')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setFormOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          {t('editBank')}
        </Button>
      </div>

      <BankDetailView bank={bank} locale={locale} />

      <BankFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        companyId={companyId}
        bank={bank}
        onSubmit={(data) => updateMutation.mutate(data)}
        loading={updateMutation.isPending}
      />
    </div>
  );
}
