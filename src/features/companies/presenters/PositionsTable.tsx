'use client';

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { PositionListItem } from '../types/position.types';
import { useTranslations } from 'next-intl';

export interface PositionsTableProps {
  positions: PositionListItem[];
  loading?: boolean;
  togglingId?: number | null;
  onEdit: (position: PositionListItem) => void;
  onDelete: (position: PositionListItem) => void;
  onToggleStatus: (position: PositionListItem) => void;
}

export function PositionsTable({
  positions,
  loading = false,
  togglingId = null,
  onEdit,
  onDelete,
  onToggleStatus,
}: PositionsTableProps) {
  const t = useTranslations('positions');
  const tCommon = useTranslations('common');

  const columns: Column<PositionListItem>[] = [
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
      key: 'vacationNorm',
      header: t('vacationNorm'),
      render: (item) => <span>{item.vacationNorm}</span>,
    },
    {
      key: 'isBlueCollar',
      header: t('isBlueCollar'),
      render: (item) => (
        <Badge variant={item.isBlueCollar ? 'default' : 'outline'}>
          {item.isBlueCollar ? t('blueCollar') : t('whiteCollar')}
        </Badge>
      ),
    },
    {
      key: 'orgChartLevelName',
      header: t('orgChartLevel'),
      render: (item) => (
        <span className="text-muted-foreground text-sm">
          {item.orgChartLevelName ?? '—'}
        </span>
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
      data={positions}
      columns={columns}
      loading={loading}
      emptyMessage={t('noPositions')}
    />
  );
}
