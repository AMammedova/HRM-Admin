'use client';

import * as React from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { BankListItem } from '../types/bank.types';
import { useTranslations } from 'next-intl';

export interface BanksTableProps {
  banks: BankListItem[];
  loading?: boolean;
  togglingId?: number | null;
  onView: (bank: BankListItem) => void;
  onEdit: (bank: BankListItem) => void;
  onDelete: (bank: BankListItem) => void;
  onToggleStatus: (bank: BankListItem) => void;
}

export function BanksTable({
  banks,
  loading = false,
  togglingId = null,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: BanksTableProps) {
  const t = useTranslations('banks');
  const tCommon = useTranslations('common');

  const columns: Column<BankListItem>[] = [
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
      key: 'taxId',
      header: t('taxId'),
    },
    {
      key: 'swiftCode',
      header: t('swiftCode'),
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
      data={banks}
      columns={columns}
      loading={loading}
      emptyMessage={t('noBanks')}
    />
  );
}
