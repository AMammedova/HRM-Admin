'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { branchWorkingHoursApi } from '../api/branch-working-hours.api';
import { branchesApi } from '../api/branches.api';
import { BranchWorkingHoursTable } from '../presenters/BranchWorkingHoursTable';
import { BranchWorkingHourFormModal } from '../components/BranchWorkingHourFormModal';
import { ConfirmDialog } from '@/shared/molecules/ConfirmDialog';
import { useToast } from '@/shared/hooks/useToast';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { Button } from '@/shared/atoms/Button';
import { BranchWorkingHour } from '../types/branch-working-hour.types';
import { BranchWorkingHourFormData } from '@/validators/branch-working-hour.schema';

export interface BranchWorkingHoursContainerProps {
  branchId: number;
  locale: string;
}

export function BranchWorkingHoursContainer({
  branchId,
  locale: _locale,
}: BranchWorkingHoursContainerProps) {
  const companyId = useCompanyId();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<BranchWorkingHour | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<BranchWorkingHour | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('branchWorkingHours');
  const tCommon = useTranslations('common');

  const { data: branch } = useQuery({
    queryKey: ['company-branch', companyId, branchId],
    queryFn: () => branchesApi.getById(companyId!, branchId),
    enabled: !!companyId,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['branch-working-hours', companyId, branchId],
    queryFn: () => branchWorkingHoursApi.list(companyId!, branchId),
    enabled: !!companyId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: BranchWorkingHourFormData) =>
      branchWorkingHoursApi.create(companyId!, branchId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branch-working-hours', companyId, branchId] });
      queryClient.invalidateQueries({ queryKey: ['company-branch-detail', companyId, branchId] });
      toast({ title: t('createSuccess'), variant: 'default' });
      setFormOpen(false);
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
    mutationFn: (payload: BranchWorkingHourFormData) =>
      branchWorkingHoursApi.update(companyId!, branchId, editingItem!.id, {
        ...payload,
        id: editingItem!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branch-working-hours', companyId, branchId] });
      queryClient.invalidateQueries({ queryKey: ['company-branch-detail', companyId, branchId] });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
      setEditingItem(null);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('updateError'),
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => branchWorkingHoursApi.remove(companyId!, branchId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branch-working-hours', companyId, branchId] });
      queryClient.invalidateQueries({ queryKey: ['company-branch-detail', companyId, branchId] });
      toast({ title: t('deleteSuccess'), variant: 'default' });
      setDeleteItem(null);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('deleteError'),
        variant: 'destructive',
      });
    },
  });

  const handleCreate = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: BranchWorkingHour) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: BranchWorkingHourFormData) => {
    if (editingItem) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingItem(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteItem) {
      deleteMutation.mutate(deleteItem.id);
    }
  };

  if (!companyId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {tCommon('noCompanyInSession')}
      </div>
    );
  }

  const branchName =
    branch?.translations.find((tr) => tr.languageCode === _locale)?.name ??
    branch?.translations[0]?.name ??
    branch?.code;

  return (
    <div className="space-y-4">
      {branchName && (
        <p className="text-sm text-muted-foreground">
          {t('branchLabel')}: <span className="font-medium text-foreground">{branchName}</span>
        </p>
      )}

      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('createWorkingHour')}
        </Button>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {t('loadError')}
        </div>
      ) : (
        <BranchWorkingHoursTable
          workingHours={data ?? []}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={setDeleteItem}
        />
      )}

      <BranchWorkingHourFormModal
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        companyId={companyId}
        branchId={branchId}
        workingHour={editingItem}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteWorkingHour')}
        description={t('deleteConfirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
