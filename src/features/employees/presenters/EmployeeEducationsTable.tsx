'use client';

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { EmployeeEducation } from '../types/employee-education.types';
import { formatDate } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

export interface EmployeeEducationsTableProps {
  educations: EmployeeEducation[];
  loading?: boolean;
  locale: string;
  onEdit: (education: EmployeeEducation) => void;
  onDelete: (education: EmployeeEducation) => void;
}

export function EmployeeEducationsTable({
  educations,
  loading = false,
  locale,
  onEdit,
  onDelete,
}: EmployeeEducationsTableProps) {
  const t = useTranslations('employeeEducations');
  const tCommon = useTranslations('common');

  const columns: Column<EmployeeEducation>[] = [
    {
      key: 'organizationCode',
      header: t('organizationCode'),
      render: (item) => <div className="font-medium">{item.organizationCode}</div>,
    },
    {
      key: 'profession',
      header: t('profession'),
    },
    {
      key: 'documentNumber',
      header: t('documentNumber'),
    },
    {
      key: 'startDate',
      header: t('startDate'),
      render: (item) => formatDate(item.startDate, locale),
    },
    {
      key: 'endDate',
      header: t('endDate'),
      render: (item) => formatDate(item.endDate, locale),
    },
    {
      key: 'educationLevelLookupValueId',
      header: t('educationLevelLookupValueId'),
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
            aria-label={`${tCommon('edit')} ${item.organizationCode}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
            aria-label={`${tCommon('delete')} ${item.organizationCode}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={educations}
      columns={columns}
      loading={loading}
      emptyMessage={t('noEducations')}
    />
  );
}
