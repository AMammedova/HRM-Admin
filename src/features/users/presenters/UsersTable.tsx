'use client';

import * as React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { User } from '../types/user.types';
import { formatDate } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

export interface UsersTableProps {
  users: User[];
  loading?: boolean;
  locale: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

export function UsersTable({
  users,
  loading = false,
  locale,
  onEdit,
  onDelete,
  onView,
  onSort,
}: UsersTableProps) {
  const t = useTranslations('users');
  const tCommon = useTranslations('common');

  const columns: Column<User>[] = [
    {
      key: 'firstName',
      header: t('firstName'),
      sortable: true,
      render: (user) => (
        <div className="font-medium">
          {user.firstName} {user.lastName}
        </div>
      ),
    },
    {
      key: 'email',
      header: t('email'),
      sortable: true,
      render: (user) => <div className="text-sm text-muted-foreground">{user.email}</div>,
    },
    {
      key: 'department',
      header: t('department'),
      sortable: true,
    },
    {
      key: 'position',
      header: t('position'),
    },
    {
      key: 'status',
      header: t('status'),
      render: (user) => (
        <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
          {t(user.status)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: t('createdAt'),
      render: (user) => <div className="text-sm">{formatDate(user.createdAt, locale)}</div>,
    },
    {
      key: 'actions',
      header: tCommon('actions'),
      render: (user) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(user)}
            aria-label={`${tCommon('view')} ${user.firstName} ${user.lastName}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(user)}
            aria-label={`${tCommon('edit')} ${user.firstName} ${user.lastName}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(user)}
            aria-label={`${tCommon('delete')} ${user.firstName} ${user.lastName}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      loading={loading}
      onSort={onSort}
      emptyMessage={t('noUsers')}
    />
  );
}

