'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { overtimeSettingsApi } from '../api/overtime-settings.api';
import { OvertimeSettingsTable } from '../presenters/OvertimeSettingsTable';
import { OvertimeSettingFormModal } from '../components/OvertimeSettingFormModal';
import { OvertimeSettingViewModal } from '../components/OvertimeSettingViewModal';
import { SearchBar } from '@/shared/molecules/SearchBar';
import { Pagination } from '@/shared/molecules/Pagination';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { usePagination } from '@/shared/hooks/usePagination';
import { useToast } from '@/shared/hooks/useToast';
import { Button } from '@/shared/atoms/Button';
import { Label } from '@/shared/atoms/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/atoms/Select';
import {
  OvertimeSettingListItem,
  OvertimeSettingsQueryParams,
} from '../types/overtime-setting.types';
import { OvertimeSettingFormData } from '@/validators/overtime-setting.schema';

function filterByStatus(
  items: OvertimeSettingListItem[],
  isActiveFilter: string
): OvertimeSettingListItem[] {
  if (isActiveFilter === 'active') return items.filter((item) => item.isActive);
  if (isActiveFilter === 'inactive') return items.filter((item) => !item.isActive);
  return items;
}

function filterBySearch(
  items: OvertimeSettingListItem[],
  search: string
): OvertimeSettingListItem[] {
  if (!search.trim()) return items;
  const query = search.trim().toLowerCase();
  return items.filter(
    (item) =>
      item.code.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)
  );
}

export function OvertimeSettingsContainer({ locale }: { locale: string }) {
  const [search, setSearch] = React.useState('');
  const [isActiveFilter, setIsActiveFilter] = React.useState<string>('all');
  const [formOpen, setFormOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [viewingId, setViewingId] = React.useState<number | null>(null);
  const [togglingId, setTogglingId] = React.useState<number | null>(null);
  const [updatingSortOrderId, setUpdatingSortOrderId] = React.useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { page, pageSize, setPage } = usePagination();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('overtimeSettings');
  const tCommon = useTranslations('common');

  const useClientStatusFilter = isActiveFilter !== 'all';

  const listQueryParams: OvertimeSettingsQueryParams = {
    page,
    pageSize,
    search: debouncedSearch,
  };

  const { data: listData, isLoading: isLoadingList, isError: isListError } = useQuery({
    queryKey: ['overtime-settings', listQueryParams],
    queryFn: () => overtimeSettingsApi.list(listQueryParams),
    enabled: !useClientStatusFilter,
  });

  const { data: allData, isLoading: isLoadingAll, isError: isAllError } = useQuery({
    queryKey: ['overtime-settings-all'],
    queryFn: () => overtimeSettingsApi.getAll(),
    enabled: useClientStatusFilter,
  });

  const { data: editingSetting, isLoading: isLoadingSetting } = useQuery({
    queryKey: ['overtime-setting', editingId],
    queryFn: () => overtimeSettingsApi.getById(editingId!),
    enabled: !!editingId && formOpen,
  });

  const { data: viewingSetting, isLoading: isLoadingView } = useQuery({
    queryKey: ['overtime-setting', viewingId],
    queryFn: () => overtimeSettingsApi.getById(viewingId!),
    enabled: !!viewingId && viewOpen,
  });

  React.useEffect(() => {
    setPage(1);
  }, [isActiveFilter, debouncedSearch, setPage]);

  const handleStatusFilterChange = (value: string) => {
    setIsActiveFilter(value);
    setPage(1);
  };

  const { tableItems, pagination } = React.useMemo(() => {
    if (!useClientStatusFilter) {
      return {
        tableItems: listData?.data ?? [],
        pagination: listData?.pagination,
      };
    }

    const filtered = filterBySearch(
      filterByStatus(allData ?? [], isActiveFilter),
      debouncedSearch
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

    return {
      tableItems: filtered.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        total: filtered.length,
        totalPages,
      },
    };
  }, [
    useClientStatusFilter,
    listData,
    allData,
    isActiveFilter,
    debouncedSearch,
    page,
    pageSize,
  ]);

  const isLoading = useClientStatusFilter ? isLoadingAll : isLoadingList;
  const isError = useClientStatusFilter ? isAllError : isListError;

  const createMutation = useMutation({
    mutationFn: overtimeSettingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overtime-settings'] });
      queryClient.invalidateQueries({ queryKey: ['overtime-settings-all'] });
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
    mutationFn: ({ id, data }: { id: number; data: OvertimeSettingFormData }) =>
      overtimeSettingsApi.update(id, { ...data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overtime-settings'] });
      queryClient.invalidateQueries({ queryKey: ['overtime-settings-all'] });
      queryClient.invalidateQueries({ queryKey: ['overtime-setting', editingId] });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
      setEditingId(null);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('updateError'),
        variant: 'destructive',
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: overtimeSettingsApi.toggleStatus,
    onMutate: (id) => setTogglingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overtime-settings'] });
      queryClient.invalidateQueries({ queryKey: ['overtime-settings-all'] });
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

  const updateSortOrderMutation = useMutation({
    mutationFn: overtimeSettingsApi.updateSortOrder,
    onMutate: ({ items }) => setUpdatingSortOrderId(items[0]?.id ?? null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overtime-settings'] });
      queryClient.invalidateQueries({ queryKey: ['overtime-settings-all'] });
      toast({ title: t('sortOrderUpdateSuccess'), variant: 'default' });
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('sortOrderUpdateError'),
        variant: 'destructive',
      });
    },
    onSettled: () => setUpdatingSortOrderId(null),
  });

  const handleCreate = () => {
    setEditingId(null);
    setFormOpen(true);
  };

  const handleView = (item: OvertimeSettingListItem) => {
    setViewingId(item.id);
    setViewOpen(true);
  };

  const handleViewOpenChange = (open: boolean) => {
    setViewOpen(open);
    if (!open) setViewingId(null);
  };

  const handleViewEdit = () => {
    if (!viewingId) return;
    setViewOpen(false);
    setEditingId(viewingId);
    setViewingId(null);
    setFormOpen(true);
  };

  const handleEdit = (item: OvertimeSettingListItem) => {
    setEditingId(item.id);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: OvertimeSettingFormData) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingId(null);
  };

  const handleToggleStatus = (item: OvertimeSettingListItem) => {
    toggleStatusMutation.mutate(item.id);
  };

  const handleSortOrderChange = (item: OvertimeSettingListItem, sortOrder: number) => {
    updateSortOrderMutation.mutate({
      items: [{ id: item.id, sortOrder: Math.max(0, sortOrder) }],
    });
  };

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {t('loadError')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 sm:max-w-md">
            <SearchBar
              placeholder={t('searchPlaceholder')}
              value={search}
              onSearchChange={setSearch}
            />
          </div>
          <div className="space-y-2 w-full sm:w-48">
            <Label>{t('status')}</Label>
            <Select value={isActiveFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="active">{t('active')}</SelectItem>
                <SelectItem value="inactive">{t('inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('createSetting')}
        </Button>
      </div>

      <OvertimeSettingsTable
        settings={tableItems}
        loading={isLoading}
        togglingId={togglingId}
        updatingSortOrderId={updatingSortOrderId}
        onView={handleView}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onSortOrderChange={handleSortOrderChange}
      />

      {pagination && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <OvertimeSettingViewModal
        open={viewOpen}
        onOpenChange={handleViewOpenChange}
        setting={viewingSetting}
        loading={isLoadingView}
        locale={locale}
        onEdit={handleViewEdit}
      />

      <OvertimeSettingFormModal
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        setting={editingId ? editingSetting : null}
        loadingSetting={editingId ? isLoadingSetting : false}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
