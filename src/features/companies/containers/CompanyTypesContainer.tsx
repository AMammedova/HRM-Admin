'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { companyTypesApi } from '../api/company-types.api';
import { CompanyTypesTable } from '../presenters/CompanyTypesTable';
import { SearchBar } from '@/shared/molecules/SearchBar';
import { Pagination } from '@/shared/molecules/Pagination';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { usePagination } from '@/shared/hooks/usePagination';
import { useToast } from '@/shared/hooks/useToast';
import {
  COMPANY_TYPE_SORT_BY,
  CompanyTypeListItem,
  CompanyTypesQueryParams,
} from '../types/company-type.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/atoms/Select';
import { Label } from '@/shared/atoms/Label';

export interface CompanyTypesContainerProps {
  locale: string;
}

const SORT_KEY_MAP: Record<string, number> = {
  code: COMPANY_TYPE_SORT_BY.CODE,
  name: COMPANY_TYPE_SORT_BY.NAME,
  sortOrder: COMPANY_TYPE_SORT_BY.SORT_ORDER,
};

export function CompanyTypesContainer({ locale }: CompanyTypesContainerProps) {
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<number | undefined>();
  const [sortDesc, setSortDesc] = React.useState(false);
  const [isActiveFilter, setIsActiveFilter] = React.useState<string>('all');
  const [togglingId, setTogglingId] = React.useState<number | null>(null);
  const [updatingSortOrderId, setUpdatingSortOrderId] = React.useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { page, pageSize, setPage } = usePagination();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations('companyTypes');
  const tCommon = useTranslations('common');

  const queryParams: CompanyTypesQueryParams = {
    page,
    pageSize,
    search: debouncedSearch,
    sortBy,
    sortDesc,
    isActive:
      isActiveFilter === 'all' ? undefined : isActiveFilter === 'active',
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-types', queryParams],
    queryFn: () => companyTypesApi.list(queryParams),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: companyTypesApi.toggleStatus,
    onMutate: (id) => setTogglingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-types'] });
      queryClient.invalidateQueries({ queryKey: ['company-types-all'] });
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
    mutationFn: companyTypesApi.updateSortOrder,
    onMutate: ({ id }) => setUpdatingSortOrderId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-types'] });
      queryClient.invalidateQueries({ queryKey: ['company-types-all'] });
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

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortBy(SORT_KEY_MAP[key]);
    setSortDesc(direction === 'desc');
  };

  const handleEdit = (item: CompanyTypeListItem) => {
    router.push(`/${locale}/companies/company-types/${item.id}/edit`);
  };

  const handleToggleStatus = (item: CompanyTypeListItem) => {
    toggleStatusMutation.mutate(item.id);
  };

  const handleSortOrderChange = (item: CompanyTypeListItem, sortOrder: number) => {
    updateSortOrderMutation.mutate({ id: item.id, sortOrder: Math.max(0, sortOrder) });
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <SearchBar
            placeholder={t('searchPlaceholder')}
            value={search}
            onSearchChange={setSearch}
          />
        </div>
        <div className="space-y-2 w-full sm:w-48">
          <Label>{t('status')}</Label>
          <Select value={isActiveFilter} onValueChange={setIsActiveFilter}>
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

      <CompanyTypesTable
        companyTypes={data?.data || []}
        loading={isLoading}
        togglingId={togglingId}
        updatingSortOrderId={updatingSortOrderId}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onSortOrderChange={handleSortOrderChange}
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
    </div>
  );
}
