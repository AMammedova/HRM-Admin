'use client';

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { CompanyPhone } from '../types/company-phone.types';
import { useTranslations } from 'next-intl';

export interface CompanyPhonesTableProps {
  phones: CompanyPhone[];
  loading?: boolean;
  onEdit: (phone: CompanyPhone) => void;
  onDelete: (phone: CompanyPhone) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

export function CompanyPhonesTable({
  phones,
  loading = false,
  onEdit,
  onDelete,
  onSort,
}: CompanyPhonesTableProps) {
  const t = useTranslations('companyPhones');
  const tCommon = useTranslations('common');

  const columns: Column<CompanyPhone>[] = [
    {
      key: 'orderNo',
      header: t('orderNo'),
      sortable: true,
      render: (item) => <div className="font-medium">{item.orderNo}</div>,
    },
    {
      key: 'number',
      header: t('number'),
      sortable: true,
    },
    {
      key: 'isFax',
      header: t('isFax'),
      render: (item) => (
        <Badge variant={item.isFax ? 'secondary' : 'outline'}>
          {item.isFax ? t('fax') : t('phone')}
        </Badge>
      ),
    },
    {
      key: 'isActive',
      header: t('status'),
      render: (item) => (
        <Badge variant={item.isActive ? 'success' : 'secondary'}>
          {item.isActive ? t('active') : t('inactive')}
        </Badge>
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
            onClick={() => onEdit(item)}
            aria-label={`${tCommon('edit')} ${item.number}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
            aria-label={`${tCommon('delete')} ${item.number}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={phones}
      columns={columns}
      loading={loading}
      onSort={onSort}
      emptyMessage={t('noPhones')}
    />
  );
}
