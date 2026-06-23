'use client';

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { EmployeeDocument } from '../types/employee-document.types';
import { useTranslations } from 'next-intl';

export interface EmployeeDocumentsTableProps {
  documents: EmployeeDocument[];
  loading?: boolean;
  onEdit: (document: EmployeeDocument) => void;
  onDelete: (document: EmployeeDocument) => void;
}

export function EmployeeDocumentsTable({
  documents,
  loading = false,
  onEdit,
  onDelete,
}: EmployeeDocumentsTableProps) {
  const t = useTranslations('employeeDocuments');
  const tCommon = useTranslations('common');

  const columns: Column<EmployeeDocument>[] = [
    {
      key: 'documentCode',
      header: t('documentCode'),
      render: (item) => <div className="font-medium">{item.documentCode}</div>,
    },
    {
      key: 'hasBeenPresented',
      header: t('hasBeenPresented'),
      render: (item) => (
        <Badge variant={item.hasBeenPresented ? 'success' : 'secondary'}>
          {item.hasBeenPresented ? tCommon('yes') : tCommon('no')}
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
            aria-label={`${tCommon('edit')} ${item.documentCode}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
            aria-label={`${tCommon('delete')} ${item.documentCode}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={documents}
      columns={columns}
      loading={loading}
      emptyMessage={t('noDocuments')}
    />
  );
}
