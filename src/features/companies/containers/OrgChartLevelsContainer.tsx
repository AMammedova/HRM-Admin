'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Plus, Download, List, GitBranch } from 'lucide-react';
import { orgChartLevelsApi } from '../api/org-chart-levels.api';
import { orgChartLinesApi } from '../api/org-chart-lines.api';
import { OrgChartLevelsTable } from '../presenters/OrgChartLevelsTable';
import { OrgChartLevelTreeView } from '../presenters/OrgChartLevelTreeView';
import { OrgChartLevelFormModal } from '../components/OrgChartLevelFormModal';
import { Pagination } from '@/shared/molecules/Pagination';
import { ConfirmDialog } from '@/shared/molecules/ConfirmDialog';
import { SearchBar } from '@/shared/molecules/SearchBar';
import { usePagination } from '@/shared/hooks/usePagination';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useToast } from '@/shared/hooks/useToast';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { Button } from '@/shared/atoms/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/atoms/Tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/atoms/Select';
import { OrgChartLevelListItem, OrgChartLevelsQueryParams } from '../types/org-chart-level.types';
import { OrgChartLevelFormData } from '@/validators/org-chart-level.schema';

export interface OrgChartLevelsContainerProps {
  locale: string;
}

export function OrgChartLevelsContainer({ locale: _locale }: OrgChartLevelsContainerProps) {
  const companyId = useCompanyId();
  const [activeTab, setActiveTab] = React.useState<'list' | 'tree'>('list');
  const [search, setSearch] = React.useState('');
  const [filterLineId, setFilterLineId] = React.useState<number | undefined>(undefined);
  const [treeLineId, setTreeLineId] = React.useState<number | undefined>(undefined);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<OrgChartLevelListItem | null>(null);
  const [togglingId, setTogglingId] = React.useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { page, pageSize, setPage } = usePagination();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('orgChartLevels');
  const tCommon = useTranslations('common');

  const queryParams: OrgChartLevelsQueryParams = {
    page,
    pageSize,
    search: debouncedSearch,
    orgChartLineId: filterLineId,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-org-chart-levels', companyId, queryParams],
    queryFn: () => orgChartLevelsApi.list(companyId!, queryParams),
    enabled: !!companyId,
  });

  const { data: editingItem, isLoading: isLoadingItem } = useQuery({
    queryKey: ['company-org-chart-level', companyId, editingId],
    queryFn: () => orgChartLevelsApi.getById(companyId!, editingId!),
    enabled: !!companyId && !!editingId && formOpen,
  });

  const { data: orgChartLines = [] } = useQuery({
    queryKey: ['company-org-chart-lines-all', companyId],
    queryFn: () => orgChartLinesApi.getAll(companyId!),
    enabled: !!companyId,
  });

  const { data: treeData = [], isLoading: isLoadingTree } = useQuery({
    queryKey: ['company-org-chart-levels-tree', companyId, treeLineId],
    queryFn: () => orgChartLevelsApi.getTree(companyId!, treeLineId!),
    enabled: !!companyId && !!treeLineId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: OrgChartLevelFormData) =>
      orgChartLevelsApi.create(companyId!, {
        ...payload,
        parentId: payload.parentId ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-org-chart-levels', companyId] });
      toast({ title: t('createSuccess'), variant: 'default' });
      setFormOpen(false);
    },
    onError: () => {
      toast({ title: tCommon('error'), description: t('createError'), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: OrgChartLevelFormData) =>
      orgChartLevelsApi.update(companyId!, editingId!, {
        ...payload,
        id: editingId!,
        parentId: payload.parentId ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-org-chart-levels', companyId] });
      queryClient.invalidateQueries({
        queryKey: ['company-org-chart-level', companyId, editingId],
      });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
      setEditingId(null);
    },
    onError: () => {
      toast({ title: tCommon('error'), description: t('updateError'), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => orgChartLevelsApi.remove(companyId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-org-chart-levels', companyId] });
      toast({ title: t('deleteSuccess'), variant: 'default' });
      setDeleteItem(null);
    },
    onError: () => {
      toast({ title: tCommon('error'), description: t('deleteError'), variant: 'destructive' });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => orgChartLevelsApi.toggleStatus(companyId!, id),
    onMutate: (id) => setTogglingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-org-chart-levels', companyId] });
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

  const handleExport = async () => {
    try {
      const blob = await orgChartLevelsApi.exportCsv(companyId!);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `org-chart-levels-${companyId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: tCommon('error'), description: t('exportError'), variant: 'destructive' });
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormOpen(true);
  };

  const handleEdit = (item: OrgChartLevelListItem) => {
    setEditingId(item.id);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: OrgChartLevelFormData) => {
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
    if (deleteItem) deleteMutation.mutate(deleteItem.id);
  };

  const handleToggleStatus = (item: OrgChartLevelListItem) => {
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
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'list' | 'tree')}>
        {/* Top toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-1.5">
                <List className="h-3.5 w-3.5" />
                {t('listView')}
              </TabsTrigger>
              <TabsTrigger value="tree" className="flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5" />
                {t('treeView')}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              {t('export')}
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              {t('createOrgChartLevel')}
            </Button>
          </div>
        </div>

        {/* LIST TAB */}
        <TabsContent value="list" className="space-y-4 mt-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar
              placeholder={t('searchPlaceholder')}
              value={search}
              onSearchChange={setSearch}
              className="sm:max-w-xs"
            />
            <Select
              value={filterLineId != null ? String(filterLineId) : '__all__'}
              onValueChange={(val) =>
                setFilterLineId(val === '__all__' ? undefined : Number(val))
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('filterByLine')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{t('allLines')}</SelectItem>
                {orgChartLines.map((line) => (
                  <SelectItem key={line.id} value={String(line.id)}>
                    {line.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isError ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              {t('loadError')}
            </div>
          ) : (
            <>
              <OrgChartLevelsTable
                levels={data?.data || []}
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
        </TabsContent>

        {/* TREE TAB */}
        <TabsContent value="tree" className="space-y-4 mt-0">
          <div className="flex items-center gap-3">
            <Select
              value={treeLineId != null ? String(treeLineId) : ''}
              onValueChange={(val) => setTreeLineId(Number(val))}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder={t('selectLineForTree')} />
              </SelectTrigger>
              <SelectContent>
                {orgChartLines.map((line) => (
                  <SelectItem key={line.id} value={String(line.id)}>
                    {line.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!treeLineId ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
              {t('selectLinePrompt')}
            </div>
          ) : (
            <OrgChartLevelTreeView tree={treeData} loading={isLoadingTree} />
          )}
        </TabsContent>
      </Tabs>

      <OrgChartLevelFormModal
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        companyId={companyId}
        orgChartLevel={editingId ? editingItem : null}
        loadingOrgChartLevel={editingId ? isLoadingItem : false}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteOrgChartLevel')}
        description={t('deleteConfirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
