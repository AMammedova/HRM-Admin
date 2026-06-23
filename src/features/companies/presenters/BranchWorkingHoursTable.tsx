'use client';

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { BranchWorkingHour, toInputTime } from '../types/branch-working-hour.types';
import { useTranslations } from 'next-intl';

export interface BranchWorkingHoursTableProps {
  workingHours: BranchWorkingHour[];
  loading?: boolean;
  onEdit: (item: BranchWorkingHour) => void;
  onDelete: (item: BranchWorkingHour) => void;
}

export function BranchWorkingHoursTable({
  workingHours,
  loading = false,
  onEdit,
  onDelete,
}: BranchWorkingHoursTableProps) {
  const t = useTranslations('branchWorkingHours');
  const tCommon = useTranslations('common');

  const formatTime = (value: string) => toInputTime(value);

  const columns: Column<BranchWorkingHour>[] = [
    {
      key: 'jobStartTime',
      header: t('jobStartTime'),
      render: (item) => <span className="font-mono">{formatTime(item.jobStartTime)}</span>,
    },
    {
      key: 'jobEndTime',
      header: t('jobEndTime'),
      render: (item) => <span className="font-mono">{formatTime(item.jobEndTime)}</span>,
    },
    {
      key: 'lunchStartTime',
      header: t('lunchStartTime'),
      render: (item) => <span className="font-mono">{formatTime(item.lunchStartTime)}</span>,
    },
    {
      key: 'lunchEndTime',
      header: t('lunchEndTime'),
      render: (item) => <span className="font-mono">{formatTime(item.lunchEndTime)}</span>,
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
            aria-label={tCommon('edit')}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
            aria-label={tCommon('delete')}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={workingHours}
      columns={columns}
      loading={loading}
      emptyMessage={t('noWorkingHours')}
    />
  );
}
