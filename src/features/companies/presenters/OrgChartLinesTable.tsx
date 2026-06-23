'use client';

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { OrgChartLineListItem } from '../types/org-chart-line.types';
import { useTranslations } from 'next-intl';

export interface OrgChartLinesTableProps {
  orgChartLines: OrgChartLineListItem[];
  loading?: boolean;
  togglingId?: number | null;
  onEdit: (item: OrgChartLineListItem) => void;
  onDelete: (item: OrgChartLineListItem) => void;
  onToggleStatus: (item: OrgChartLineListItem) => void;
}

export function OrgChartLinesTable({
  orgChartLines,
  loading = false,
  togglingId = null,
  onEdit,
  onDelete,
  onToggleStatus,
}: OrgChartLinesTableProps) {
  const t = useTranslations('orgChartLines');
  const tCommon = useTranslations('common');

  const columns: Column<OrgChartLineListItem>[] = [
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
      key: 'isVisible',
      header: t('visibility'),
      render: (item) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={item.isVisible}
            disabled={togglingId === item.id}
            onCheckedChange={() => onToggleStatus(item)}
            aria-label={item.isVisible ? t('hide') : t('show')}
          />
          <Badge variant={item.isVisible ? 'success' : 'secondary'}>
            {item.isVisible ? t('visible') : t('hidden')}
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
      data={orgChartLines}
      columns={columns}
      loading={loading}
      emptyMessage={t('noOrgChartLines')}
    />
  );
}
