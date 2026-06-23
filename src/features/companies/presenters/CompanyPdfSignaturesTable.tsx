'use client';

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { CompanyPdfSignature } from '../types/company-pdf-signature.types';
import { useTranslations } from 'next-intl';

export interface CompanyPdfSignaturesTableProps {
  signatures: CompanyPdfSignature[];
  loading?: boolean;
  onEdit: (signature: CompanyPdfSignature) => void;
  onDelete: (signature: CompanyPdfSignature) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

export function CompanyPdfSignaturesTable({
  signatures,
  loading = false,
  onEdit,
  onDelete,
  onSort,
}: CompanyPdfSignaturesTableProps) {
  const t = useTranslations('companyPdfSignatures');
  const tCommon = useTranslations('common');

  const columns: Column<CompanyPdfSignature>[] = [
    {
      key: 'name',
      header: t('name'),
      sortable: true,
      render: (item) => <div className="font-medium">{item.name}</div>,
    },
    {
      key: 'filePath',
      header: t('filePath'),
      sortable: true,
      render: (item) => (
        <div className="max-w-xs truncate text-sm text-muted-foreground">{item.filePath}</div>
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
      data={signatures}
      columns={columns}
      loading={loading}
      onSort={onSort}
      emptyMessage={t('noSignatures')}
    />
  );
}
