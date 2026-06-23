'use client';

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { OrgChartLevelListItem } from '../types/org-chart-level.types';
import { useTranslations } from 'next-intl';

export interface OrgChartLevelsTableProps {
  levels: OrgChartLevelListItem[];
  loading?: boolean;
  togglingId?: number | null;
  onEdit: (item: OrgChartLevelListItem) => void;
  onDelete: (item: OrgChartLevelListItem) => void;
  onToggleStatus: (item: OrgChartLevelListItem) => void;
}

export function OrgChartLevelsTable({
  levels,
  loading = false,
  togglingId = null,
  onEdit,
  onDelete,
  onToggleStatus,
}: OrgChartLevelsTableProps) {
  const t = useTranslations('orgChartLevels');
  const tCommon = useTranslations('common');

  const columns: Column<OrgChartLevelListItem>[] = [
    {
      key: 'code',
      header: t('code'),
      render: (item) => <div className="font-mono text-sm font-medium">{item.code}</div>,
    },
    {
      key: 'name',
      header: t('name'),
      render: (item) => (
        <span className={item.name ? undefined : 'italic text-muted-foreground'}>
          {item.name || '—'}
        </span>
      ),
    },
    {
      key: 'orgChartLineName',
      header: t('orgChartLine'),
      render: (item) => (
        <Badge variant="outline">{item.orgChartLineName ?? '—'}</Badge>
      ),
    },
    {
      key: 'parentName',
      header: t('parentLevel'),
      render: (item) => (
        <span className="text-sm text-muted-foreground">{item.parentName ?? '—'}</span>
      ),
    },
    {
      key: 'levelNo',
      header: t('levelNo'),
      render: (item) => (
        <Badge variant="secondary">{item.levelNo}</Badge>
      ),
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
      data={levels}
      columns={columns}
      loading={loading}
      emptyMessage={t('noOrgChartLevels')}
    />
  );
}
