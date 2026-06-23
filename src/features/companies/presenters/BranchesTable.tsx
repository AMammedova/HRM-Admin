'use client';

import * as React from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { BranchListItem } from '../types/branch.types';
import { useTranslations } from 'next-intl';

export interface BranchesTableProps {
  branches: BranchListItem[];
  loading?: boolean;
  togglingId?: number | null;
  onView: (branch: BranchListItem) => void;
  onEdit: (branch: BranchListItem) => void;
  onDelete: (branch: BranchListItem) => void;
  onToggleStatus: (branch: BranchListItem) => void;
}

export function BranchesTable({
  branches,
  loading = false,
  togglingId = null,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: BranchesTableProps) {
  const t = useTranslations('branches');
  const tCommon = useTranslations('common');

  const columns: Column<BranchListItem>[] = [
    {
      key: 'code',
      header: t('code'),
      render: (item) => <div className="font-medium">{item.code}</div>,
    },
    {
      key: 'name',
      header: t('name'),
    },
    {
      key: 'region',
      header: t('region'),
    },
    {
      key: 'phone',
      header: t('phone'),
    },
    {
      key: 'email',
      header: t('email'),
    },
    {
      key: 'isOffice',
      header: t('type'),
      render: (item) => (
        <Badge variant={item.isOffice ? 'default' : 'outline'}>
          {item.isOffice ? t('office') : t('branch')}
        </Badge>
      ),
    },
    {
      key: 'isActive',
      header: t('status'),
      render: (item) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={item.isActive}
            disabled={togglingId === item.id}
            onCheckedChange={() => onToggleStatus(item)}
            aria-label={item.isActive ? t('deactivate') : t('activate')}
          />
          <Badge variant={item.isActive ? 'success' : 'secondary'}>
            {item.isActive ? t('active') : t('inactive')}
          </Badge>
        </div>
      ),
    },
    {
      key: 'actions',
      header: tCommon('actions'),
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(item)}
            aria-label={`${tCommon('view')} ${item.name}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            aria-label={`${tCommon('edit')} ${item.name}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
            aria-label={`${tCommon('delete')} ${item.name}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={branches}
      columns={columns}
      loading={loading}
      emptyMessage={t('noBranches')}
    />
  );
}
