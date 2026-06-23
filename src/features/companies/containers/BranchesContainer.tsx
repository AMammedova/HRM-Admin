'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { branchesApi } from '../api/branches.api';
import { BranchesTable } from '../presenters/BranchesTable';
import { BranchFormModal } from '../components/BranchFormModal';
import { Pagination } from '@/shared/molecules/Pagination';
import { ConfirmDialog } from '@/shared/molecules/ConfirmDialog';
import { SearchBar } from '@/shared/molecules/SearchBar';
import { usePagination } from '@/shared/hooks/usePagination';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useToast } from '@/shared/hooks/useToast';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { Button } from '@/shared/atoms/Button';
import { BranchListItem, BranchesQueryParams } from '../types/branch.types';
import { BranchFormData } from '@/validators/branch.schema';

export interface BranchesContainerProps {
  locale: string;
}

export function BranchesContainer({ locale }: BranchesContainerProps) {
  const companyId = useCompanyId();
  const [search, setSearch] = React.useState('');
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingBranchId, setEditingBranchId] = React.useState<number | null>(null);
  const [deleteBranch, setDeleteBranch] = React.useState<BranchListItem | null>(null);
  const [togglingId, setTogglingId] = React.useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { page, pageSize, setPage } = usePagination();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('branches');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const queryParams: BranchesQueryParams = {
    page,
    pageSize,
    search: debouncedSearch,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-branches', companyId, queryParams],
    queryFn: () => branchesApi.list(companyId!, queryParams),
    enabled: !!companyId,
  });

  const { data: editingBranch, isLoading: isLoadingBranch } = useQuery({
    queryKey: ['company-branch', companyId, editingBranchId],
    queryFn: () => branchesApi.getById(companyId!, editingBranchId!),
    enabled: !!companyId && !!editingBranchId && formOpen,
  });

  const createMutation = useMutation({
    mutationFn: (payload: BranchFormData) => branchesApi.create(companyId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-branches', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-branches-all', companyId] });
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
    mutationFn: (payload: BranchFormData) =>
      branchesApi.update(companyId!, editingBranchId!, {
        ...payload,
        id: editingBranchId!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-branches', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-branches-all', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-branch', companyId, editingBranchId] });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
      setEditingBranchId(null);
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
    mutationFn: (id: number) => branchesApi.remove(companyId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-branches', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-branches-all', companyId] });
      toast({ title: t('deleteSuccess'), variant: 'default' });
      setDeleteBranch(null);
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
    mutationFn: (id: number) => branchesApi.toggleStatus(companyId!, id),
    onMutate: (id) => setTogglingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-branches', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-branches-all', companyId] });
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

  const handleView = (branch: BranchListItem) => {
    router.push(`/${locale}/branches/${branch.id}`);
  };

  const handleCreate = () => {
    setEditingBranchId(null);
    setFormOpen(true);
  };

  const handleEdit = (branch: BranchListItem) => {
    setEditingBranchId(branch.id);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: BranchFormData) => {
    if (editingBranchId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingBranchId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteBranch) {
      deleteMutation.mutate(deleteBranch.id);
    }
  };

  const handleToggleStatus = (branch: BranchListItem) => {
    toggleStatusMutation.mutate(branch.id);
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
          {t('createBranch')}
        </Button>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {t('loadError')}
        </div>
      ) : (
        <>
          <BranchesTable
            branches={data?.data || []}
            loading={isLoading}
            togglingId={togglingId}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={setDeleteBranch}
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

      <BranchFormModal
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        companyId={companyId}
        branch={editingBranchId ? editingBranch : null}
        loadingBranch={editingBranchId ? isLoadingBranch : false}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteBranch}
        onOpenChange={(open) => !open && setDeleteBranch(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteBranch')}
        description={t('deleteConfirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
