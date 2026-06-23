'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { companiesApi } from '../api/companies.api';
import { CompaniesTable } from '../presenters/CompaniesTable';
import { SearchBar } from '@/shared/molecules/SearchBar';
import { Pagination } from '@/shared/molecules/Pagination';
import { ConfirmDialog } from '@/shared/molecules/ConfirmDialog';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { usePagination } from '@/shared/hooks/usePagination';
import { useToast } from '@/shared/hooks/useToast';
import { CompanyListItem } from '../types/company.types';
import { QueryParams } from '@/shared/types/api';

export interface CompaniesContainerProps {
  locale: string;
}

export function CompaniesContainer({ locale }: CompaniesContainerProps) {
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [deleteCompany, setDeleteCompany] = React.useState<CompanyListItem | null>(null);
  const [togglingId, setTogglingId] = React.useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { page, pageSize, setPage } = usePagination();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations('companies');
  const tCommon = useTranslations('common');

  const queryParams: QueryParams = {
    page,
    pageSize,
    search: debouncedSearch,
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['companies', queryParams],
    queryFn: () => companiesApi.list(queryParams),
  });

  const deleteMutation = useMutation({
    mutationFn: companiesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({ title: t('deleteSuccess'), variant: 'default' });
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
    mutationFn: companiesApi.toggleStatus,
    onMutate: (id) => setTogglingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
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

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortBy(key);
    setSortOrder(direction);
  };

  const handleEdit = (company: CompanyListItem) => {
    router.push(`/${locale}/companies/${company.id}/edit`);
  };

  const handleView = (company: CompanyListItem) => {
    router.push(`/${locale}/companies/${company.id}`);
  };

  const handleDeleteConfirm = () => {
    if (deleteCompany) {
      deleteMutation.mutate(deleteCompany.id);
      setDeleteCompany(null);
    }
  };

  const handleToggleStatus = (company: CompanyListItem) => {
    toggleStatusMutation.mutate(company.id);
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
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder={t('searchPlaceholder')}
            value={search}
            onSearchChange={setSearch}
          />
        </div>
      </div>

      <CompaniesTable
        companies={data?.data || []}
        loading={isLoading}
        locale={locale}
        togglingId={togglingId}
        onEdit={handleEdit}
        onDelete={setDeleteCompany}
        onView={handleView}
        onToggleStatus={handleToggleStatus}
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

      <ConfirmDialog
        open={!!deleteCompany}
        onOpenChange={(open) => !open && setDeleteCompany(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteCompany')}
        description={t('deleteConfirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
