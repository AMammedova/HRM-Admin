'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { banksApi } from '../api/banks.api';
import { BanksTable } from '../presenters/BanksTable';
import { BankFormModal } from '../components/BankFormModal';
import { Pagination } from '@/shared/molecules/Pagination';
import { ConfirmDialog } from '@/shared/molecules/ConfirmDialog';
import { SearchBar } from '@/shared/molecules/SearchBar';
import { usePagination } from '@/shared/hooks/usePagination';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useToast } from '@/shared/hooks/useToast';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { Button } from '@/shared/atoms/Button';
import { BankListItem, BanksQueryParams } from '../types/bank.types';
import { BankFormData } from '@/validators/bank.schema';

export interface BanksContainerProps {
  locale: string;
}

export function BanksContainer({ locale }: BanksContainerProps) {
  const companyId = useCompanyId();
  const [search, setSearch] = React.useState('');
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingBankId, setEditingBankId] = React.useState<number | null>(null);
  const [deleteBank, setDeleteBank] = React.useState<BankListItem | null>(null);
  const [togglingId, setTogglingId] = React.useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { page, pageSize, setPage } = usePagination();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('banks');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const queryParams: BanksQueryParams = {
    page,
    pageSize,
    search: debouncedSearch,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-banks', companyId, queryParams],
    queryFn: () => banksApi.list(companyId!, queryParams),
    enabled: !!companyId,
  });

  const { data: editingBank, isLoading: isLoadingBank } = useQuery({
    queryKey: ['company-bank', companyId, editingBankId],
    queryFn: () => banksApi.getById(companyId!, editingBankId!),
    enabled: !!companyId && !!editingBankId && formOpen,
  });

  const createMutation = useMutation({
    mutationFn: (payload: BankFormData) => banksApi.create(companyId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-banks', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-banks-all', companyId] });
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
    mutationFn: (payload: BankFormData) =>
      banksApi.update(companyId!, editingBankId!, {
        ...payload,
        id: editingBankId!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-banks', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-banks-all', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-bank', companyId, editingBankId] });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
      setEditingBankId(null);
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
    mutationFn: (id: number) => banksApi.remove(companyId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-banks', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-banks-all', companyId] });
      toast({ title: t('deleteSuccess'), variant: 'default' });
      setDeleteBank(null);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('deleteError'),
        variant: 'destructive',
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => banksApi.toggleStatus(companyId!, id),
    onMutate: (id) => setTogglingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-banks', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-banks-all', companyId] });
      toast({ title: t('statusToggleSuccess'), variant: 'default' });
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('statusToggleError'),
        variant: 'destructive',
      });
    },
    onSettled: () => setTogglingId(null),
  });

  const handleView = (bank: BankListItem) => {
    router.push(`/${locale}/banks/${bank.id}`);
  };

  const handleCreate = () => {
    setEditingBankId(null);
    setFormOpen(true);
  };

  const handleEdit = (bank: BankListItem) => {
    setEditingBankId(bank.id);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: BankFormData) => {
    if (editingBankId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingBankId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteBank) {
      deleteMutation.mutate(deleteBank.id);
    }
  };

  const handleToggleStatus = (bank: BankListItem) => {
    toggleStatusMutation.mutate(bank.id);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          placeholder={t('searchPlaceholder')}
          value={search}
          onSearchChange={setSearch}
          className="sm:max-w-md"
        />
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('createBank')}
        </Button>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {t('loadError')}
        </div>
      ) : (
        <>
          <BanksTable
            banks={data?.data || []}
            loading={isLoading}
            togglingId={togglingId}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={setDeleteBank}
            onToggleStatus={handleToggleStatus}
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

      <BankFormModal
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        companyId={companyId}
        bank={editingBankId ? editingBank : null}
        loadingBank={editingBankId ? isLoadingBank : false}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteBank}
        onOpenChange={(open) => !open && setDeleteBank(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteBank')}
        description={t('deleteConfirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
