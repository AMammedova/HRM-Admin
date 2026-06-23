'use client';

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { CompanySignature } from '../types/company-signature.types';
import { useTranslations } from 'next-intl';

export interface CompanySignaturesTableProps {
  signatures: CompanySignature[];
  loading?: boolean;
  onEdit: (signature: CompanySignature) => void;
  onDelete: (signature: CompanySignature) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

export function CompanySignaturesTable({
  signatures,
  loading = false,
  onEdit,
  onDelete,
  onSort,
}: CompanySignaturesTableProps) {
  const t = useTranslations('companySignatures');
  const tCommon = useTranslations('common');

  const columns: Column<CompanySignature>[] = [
    {
      key: 'orderNo',
      header: t('orderNo'),
      sortable: true,
      render: (item) => <div className="font-medium">{item.orderNo}</div>,
    },
    {
      key: 'fullName',
      header: t('fullName'),
      sortable: true,
    },
    {
      key: 'position',
      header: t('position'),
      sortable: true,
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
            aria-label={`${tCommon('edit')} ${item.fullName}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
            aria-label={`${tCommon('delete')} ${item.fullName}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={signatures}
      columns={columns}
      loading={loading}
      onSort={onSort}
      emptyMessage={t('noSignatures')}
    />
  );
}
