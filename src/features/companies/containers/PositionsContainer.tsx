'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { positionsApi } from '../api/positions.api';
import { PositionsTable } from '../presenters/PositionsTable';
import { PositionFormModal } from '../components/PositionFormModal';
import { Pagination } from '@/shared/molecules/Pagination';
import { ConfirmDialog } from '@/shared/molecules/ConfirmDialog';
import { SearchBar } from '@/shared/molecules/SearchBar';
import { usePagination } from '@/shared/hooks/usePagination';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useToast } from '@/shared/hooks/useToast';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { Button } from '@/shared/atoms/Button';
import { PositionListItem, PositionsQueryParams } from '../types/position.types';
import { PositionFormData } from '@/validators/position.schema';

export interface PositionsContainerProps {
  locale: string;
}

export function PositionsContainer({ locale: _locale }: PositionsContainerProps) {
  const companyId = useCompanyId();
  const [search, setSearch] = React.useState('');
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingPositionId, setEditingPositionId] = React.useState<number | null>(null);
  const [deletePosition, setDeletePosition] = React.useState<PositionListItem | null>(null);
  const [togglingId, setTogglingId] = React.useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { page, pageSize, setPage } = usePagination();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('positions');
  const tCommon = useTranslations('common');

  const queryParams: PositionsQueryParams = {
    page,
    pageSize,
    search: debouncedSearch,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-positions', companyId, queryParams],
    queryFn: () => positionsApi.list(companyId!, queryParams),
    enabled: !!companyId,
  });

  const { data: editingPosition, isLoading: isLoadingPosition } = useQuery({
    queryKey: ['company-position', companyId, editingPositionId],
    queryFn: () => positionsApi.getById(companyId!, editingPositionId!),
    enabled: !!companyId && !!editingPositionId && formOpen,
  });

  const createMutation = useMutation({
    mutationFn: (payload: PositionFormData) =>
      positionsApi.create(companyId!, {
        ...payload,
        orgChartLevelId: payload.orgChartLevelId ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-positions', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-positions-all', companyId] });
      toast({ title: t('createSuccess'), variant: 'default' });
      setFormOpen(false);
    },
    onError: () => {
      toast({ title: tCommon('error'), description: t('createError'), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: PositionFormData) =>
      positionsApi.update(companyId!, editingPositionId!, {
        ...payload,
        id: editingPositionId!,
        orgChartLevelId: payload.orgChartLevelId ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-positions', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-positions-all', companyId] });
      queryClient.invalidateQueries({
        queryKey: ['company-position', companyId, editingPositionId],
      });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
      setEditingPositionId(null);
    },
    onError: () => {
      toast({ title: tCommon('error'), description: t('updateError'), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => positionsApi.remove(companyId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-positions', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-positions-all', companyId] });
      toast({ title: t('deleteSuccess'), variant: 'default' });
      setDeletePosition(null);
    },
    onError: () => {
      toast({ title: tCommon('error'), description: t('deleteError'), variant: 'destructive' });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => positionsApi.toggleStatus(companyId!, id),
    onMutate: (id) => setTogglingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-positions', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-positions-all', companyId] });
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
    setEditingPositionId(null);
    setFormOpen(true);
  };

  const handleEdit = (position: PositionListItem) => {
    setEditingPositionId(position.id);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: PositionFormData) => {
    if (editingPositionId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingPositionId(null);
  };

  const handleDeleteConfirm = () => {
    if (deletePosition) {
      deleteMutation.mutate(deletePosition.id);
    }
  };

  const handleToggleStatus = (position: PositionListItem) => {
    toggleStatusMutation.mutate(position.id);
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
          {t('createPosition')}
        </Button>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {t('loadError')}
        </div>
      ) : (
        <>
          <PositionsTable
            positions={data?.data || []}
            loading={isLoading}
            togglingId={togglingId}
            onEdit={handleEdit}
            onDelete={setDeletePosition}
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

      <PositionFormModal
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        companyId={companyId}
        position={editingPositionId ? editingPosition : null}
        loadingPosition={editingPositionId ? isLoadingPosition : false}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deletePosition}
        onOpenChange={(open) => !open && setDeletePosition(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deletePosition')}
        description={t('deleteConfirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
