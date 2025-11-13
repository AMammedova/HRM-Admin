'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { usersApi } from '../services/users.api';
import { UsersTable } from '../presenters/UsersTable';
import { SearchBar } from '@/shared/molecules/SearchBar';
import { Pagination } from '@/shared/molecules/Pagination';
import { ConfirmDialog } from '@/shared/molecules/ConfirmDialog';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { usePagination } from '@/shared/hooks/usePagination';
import { useToast } from '@/shared/hooks/useToast';
import { User } from '../types/user.types';
import { QueryParams } from '@/shared/types/api';

export interface UsersContainerProps {
  locale: string;
}

export function UsersContainer({ locale }: UsersContainerProps) {
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [deleteUser, setDeleteUser] = React.useState<User | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { page, pageSize, setPage } = usePagination();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations('users');

  const queryParams: QueryParams = {
    page,
    pageSize,
    search: debouncedSearch,
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => usersApi.list(queryParams),
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: t('deleteSuccess'),
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: t('deleteSuccess'),
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    },
  });

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortBy(key);
    setSortOrder(direction);
  };

  const handleEdit = (user: User) => {
    router.push(`/${locale}/users/${user.id}/edit`);
  };

  const handleView = (user: User) => {
    router.push(`/${locale}/users/${user.id}`);
  };

  const handleDeleteConfirm = () => {
    if (deleteUser) {
      deleteMutation.mutate(deleteUser.id as string);
      setDeleteUser(null);
    }
  };

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

      <UsersTable
        users={data?.data || []}
        loading={isLoading}
        locale={locale}
        onEdit={handleEdit}
        onDelete={setDeleteUser}
        onView={handleView}
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
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteUser')}
        description={t('deleteConfirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

