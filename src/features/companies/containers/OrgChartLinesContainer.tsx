'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { orgChartLinesApi } from '../api/org-chart-lines.api';
import { OrgChartLinesTable } from '../presenters/OrgChartLinesTable';
import { OrgChartLineFormModal } from '../components/OrgChartLineFormModal';
import { Pagination } from '@/shared/molecules/Pagination';
import { ConfirmDialog } from '@/shared/molecules/ConfirmDialog';
import { SearchBar } from '@/shared/molecules/SearchBar';
import { usePagination } from '@/shared/hooks/usePagination';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useToast } from '@/shared/hooks/useToast';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { Button } from '@/shared/atoms/Button';
import { OrgChartLineListItem, OrgChartLinesQueryParams } from '../types/org-chart-line.types';
import { OrgChartLineFormData } from '@/validators/org-chart-line.schema';

export interface OrgChartLinesContainerProps {
  locale: string;
}

export function OrgChartLinesContainer({ locale: _locale }: OrgChartLinesContainerProps) {
  const companyId = useCompanyId();
  const [search, setSearch] = React.useState('');
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<OrgChartLineListItem | null>(null);
  const [togglingId, setTogglingId] = React.useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { page, pageSize, setPage } = usePagination();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('orgChartLines');
  const tCommon = useTranslations('common');

  const queryParams: OrgChartLinesQueryParams = {
    page,
    pageSize,
    search: debouncedSearch,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-org-chart-lines', companyId, queryParams],
    queryFn: () => orgChartLinesApi.list(companyId!, queryParams),
    enabled: !!companyId,
  });

  const { data: editingItem, isLoading: isLoadingItem } = useQuery({
    queryKey: ['company-org-chart-line', companyId, editingId],
    queryFn: () => orgChartLinesApi.getById(companyId!, editingId!),
    enabled: !!companyId && !!editingId && formOpen,
  });

  const createMutation = useMutation({
    mutationFn: (payload: OrgChartLineFormData) =>
      orgChartLinesApi.create(companyId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-org-chart-lines', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-org-chart-lines-all', companyId] });
      toast({ title: t('createSuccess'), variant: 'default' });
      setFormOpen(false);
    },
    onError: () => {
      toast({ title: tCommon('error'), description: t('createError'), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: OrgChartLineFormData) =>
      orgChartLinesApi.update(companyId!, editingId!, { ...payload, id: editingId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-org-chart-lines', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-org-chart-lines-all', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-org-chart-line', companyId, editingId] });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
      setEditingId(null);
    },
    onError: () => {
      toast({ title: tCommon('error'), description: t('updateError'), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => orgChartLinesApi.remove(companyId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-org-chart-lines', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-org-chart-lines-all', companyId] });
      toast({ title: t('deleteSuccess'), variant: 'default' });
      setDeleteItem(null);
    },
    onError: () => {
      toast({ title: tCommon('error'), description: t('deleteError'), variant: 'destructive' });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => orgChartLinesApi.toggleStatus(companyId!, id),
    onMutate: (id) => setTogglingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-org-chart-lines', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-org-chart-lines-all', companyId] });
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

  const handleCreate = () => {
    setEditingId(null);
    setFormOpen(true);
  };

  const handleEdit = (item: OrgChartLineListItem) => {
    setEditingId(item.id);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: OrgChartLineFormData) => {
    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteItem) {
      deleteMutation.mutate(deleteItem.id);
    }
  };

  const handleToggleStatus = (item: OrgChartLineListItem) => {
    toggleStatusMutation.mutate(item.id);
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
          {t('createOrgChartLine')}
        </Button>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {t('loadError')}
        </div>
      ) : (
        <>
          <OrgChartLinesTable
            orgChartLines={data?.data || []}
            loading={isLoading}
            togglingId={togglingId}
            onEdit={handleEdit}
            onDelete={setDeleteItem}
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

      <OrgChartLineFormModal
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        companyId={companyId}
        orgChartLine={editingId ? editingItem : null}
        loadingOrgChartLine={editingId ? isLoadingItem : false}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteOrgChartLine')}
        description={t('deleteConfirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
