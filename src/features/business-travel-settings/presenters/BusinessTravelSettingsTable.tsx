'use client';

import * as React from 'react';
import { Edit, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { Input } from '@/shared/atoms/Input';
import { BusinessTravelSettingListItem } from '../types/business-travel-setting.types';
import { useTranslations } from 'next-intl';

export interface BusinessTravelSettingsTableProps {
  settings: BusinessTravelSettingListItem[];
  loading?: boolean;
  togglingId?: number | null;
  updatingSortOrderId?: number | null;
  onView: (item: BusinessTravelSettingListItem) => void;
  onEdit: (item: BusinessTravelSettingListItem) => void;
  onToggleStatus: (item: BusinessTravelSettingListItem) => void;
  onSortOrderChange: (item: BusinessTravelSettingListItem, sortOrder: number) => void;
}

export function BusinessTravelSettingsTable({
  settings,
  loading = false,
  togglingId = null,
  updatingSortOrderId = null,
  onView,
  onEdit,
  onToggleStatus,
  onSortOrderChange,
}: BusinessTravelSettingsTableProps) {
  const t = useTranslations('businessTravelSettings');
  const tCommon = useTranslations('common');

  const columns: Column<BusinessTravelSettingListItem>[] = [
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
      key: 'sortOrder',
      header: t('sortOrder'),
      render: (item) => (
        <SortOrderCell
          item={item}
          disabled={updatingSortOrderId === item.id}
          onChange={onSortOrderChange}
        />
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
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={settings}
      columns={columns}
      loading={loading}
      emptyMessage={t('noSettings')}
    />
  );
}

function SortOrderCell({
  item,
  disabled,
  onChange,
}: {
  item: BusinessTravelSettingListItem;
  disabled: boolean;
  onChange: (item: BusinessTravelSettingListItem, sortOrder: number) => void;
}) {
  const [value, setValue] = React.useState(String(item.sortOrder));

  React.useEffect(() => {
    setValue(String(item.sortOrder));
  }, [item.sortOrder]);

  const commit = () => {
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed) && parsed !== item.sortOrder) {
      onChange(item, parsed);
    } else {
      setValue(String(item.sortOrder));
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        min={0}
        value={value}
        disabled={disabled}
        className="h-8 w-16"
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          }
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={disabled}
        onClick={() => onChange(item, item.sortOrder - 1)}
        aria-label="Decrease sort order"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={disabled}
        onClick={() => onChange(item, item.sortOrder + 1)}
        aria-label="Increase sort order"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
