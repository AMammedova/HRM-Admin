'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { companyPhonesApi } from '../api/company-phones.api';
import { CompanyPhonesTable } from '../presenters/CompanyPhonesTable';
import { CompanyPhoneFormModal } from '../components/CompanyPhoneFormModal';
import { Pagination } from '@/shared/molecules/Pagination';
import { ConfirmDialog } from '@/shared/molecules/ConfirmDialog';
import { usePagination } from '@/shared/hooks/usePagination';
import { useToast } from '@/shared/hooks/useToast';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { Button } from '@/shared/atoms/Button';
import { CompanyPhone, CompanyPhonesQueryParams } from '../types/company-phone.types';
import { CompanyPhoneFormData } from '@/validators/company-phone.schema';

export interface CompanyPhonesContainerProps {
  locale: string;
}

export function CompanyPhonesContainer({ locale: _locale }: CompanyPhonesContainerProps) {
  const companyId = useCompanyId();
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingPhone, setEditingPhone] = React.useState<CompanyPhone | null>(null);
  const [deletePhone, setDeletePhone] = React.useState<CompanyPhone | null>(null);

  const { page, pageSize, setPage } = usePagination();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('companyPhones');
  const tCommon = useTranslations('common');

  const queryParams: CompanyPhonesQueryParams = {
    page,
    pageSize,
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-phones', companyId, queryParams],
    queryFn: () => companyPhonesApi.list(companyId!, queryParams),
    enabled: !!companyId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CompanyPhoneFormData) => companyPhonesApi.create(companyId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-phones', companyId] });
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
    mutationFn: (payload: CompanyPhoneFormData) =>
      companyPhonesApi.update(companyId!, editingPhone!.id, {
        ...payload,
        id: editingPhone!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-phones', companyId] });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
      setEditingPhone(null);
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
    mutationFn: (id: number) => companyPhonesApi.remove(companyId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-phones', companyId] });
      toast({ title: t('deleteSuccess'), variant: 'default' });
      setDeletePhone(null);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('deleteError'),
        variant: 'destructive',
      });
    },
  });

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortBy(key);
    setSortOrder(direction);
  };

  const handleCreate = () => {
    setEditingPhone(null);
    setFormOpen(true);
  };

  const handleEdit = (phone: CompanyPhone) => {
    setEditingPhone(phone);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: CompanyPhoneFormData) => {
    if (editingPhone) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletePhone) {
      deleteMutation.mutate(deletePhone.id);
    }
  };

  if (!companyId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {tCommon('noCompanyInSession')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('createPhone')}
        </Button>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {t('loadError')}
        </div>
      ) : (
        <>
          <CompanyPhonesTable
            phones={data?.data || []}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={setDeletePhone}
            onSort={handleSort}
          />

          {data && (
            <div className="flex justify-center">
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      <CompanyPhoneFormModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingPhone(null);
        }}
        companyId={companyId}
        phone={editingPhone}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deletePhone}
        onOpenChange={(open) => !open && setDeletePhone(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deletePhone')}
        description={t('deleteConfirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
