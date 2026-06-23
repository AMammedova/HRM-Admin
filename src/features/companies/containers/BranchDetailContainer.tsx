'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Edit, Clock } from 'lucide-react';
import Link from 'next/link';
import { branchesApi } from '../api/branches.api';
import { BranchDetailView } from '../presenters/BranchDetailView';
import { BranchFormModal } from '../components/BranchFormModal';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { useToast } from '@/shared/hooks/useToast';
import { Button } from '@/shared/atoms/Button';
import { BranchFormData } from '@/validators/branch.schema';

export interface BranchDetailContainerProps {
  branchId: number;
  locale: string;
}

export function BranchDetailContainer({ branchId, locale }: BranchDetailContainerProps) {
  const companyId = useCompanyId();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('branches');
  const tCommon = useTranslations('common');
  const [formOpen, setFormOpen] = React.useState(false);

  const { data: branch, isLoading, isError } = useQuery({
    queryKey: ['company-branch-detail', companyId, branchId],
    queryFn: () => branchesApi.getDetail(companyId!, branchId),
    enabled: !!companyId,
  });

  const { data: branchForEdit } = useQuery({
    queryKey: ['company-branch', companyId, branchId],
    queryFn: () => branchesApi.getById(companyId!, branchId),
    enabled: !!companyId && formOpen,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: BranchFormData) =>
      branchesApi.update(companyId!, branchId, { ...payload, id: branchId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-branch-detail', companyId, branchId] });
      queryClient.invalidateQueries({ queryKey: ['company-branch', companyId, branchId] });
      queryClient.invalidateQueries({ queryKey: ['company-branches', companyId] });
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

  if (isError || !branch) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {t('loadError')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Link href={`/${locale}/branches/${branchId}/working-hours`}>
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            {t('manageWorkingHours')}
          </Button>
        </Link>
        <Button onClick={() => setFormOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          {t('editBranch')}
        </Button>
      </div>

      <BranchDetailView branch={branch} locale={locale} />

      <BranchFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        companyId={companyId}
        branch={branchForEdit ?? branch}
        onSubmit={(data) => updateMutation.mutate(data)}
        loading={updateMutation.isPending}
      />
    </div>
  );
}
