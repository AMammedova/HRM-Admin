'use client';

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/shared/organisms/DataTable';
import { Button } from '@/shared/atoms/Button';
import { Badge } from '@/shared/atoms/Badge';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { EmployeeDeduction } from '../types/employee-deduction.types';
import { formatDate } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

export interface EmployeeDeductionsTableProps {
  deductions: EmployeeDeduction[];
  loading?: boolean;
  locale: string;
  togglingId?: number | null;
  onEdit: (deduction: EmployeeDeduction) => void;
  onDelete: (deduction: EmployeeDeduction) => void;
  onToggleStatus: (deduction: EmployeeDeduction) => void;
}

export function EmployeeDeductionsTable({
  deductions,
  loading = false,
  locale,
  togglingId = null,
  onEdit,
  onDelete,
  onToggleStatus,
}: EmployeeDeductionsTableProps) {
  const t = useTranslations('employeeDeductions');
  const tCommon = useTranslations('common');

  const formatAmount = (item: EmployeeDeduction, value: number) =>
    item.isPercentage ? `${value}%` : value.toLocaleString();

  const columns: Column<EmployeeDeduction>[] = [
    {
      key: 'deductionType',
      header: t('deductionType'),
      render: (item) => <div className="font-medium">{item.deductionType}</div>,
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
      key: 'amount',
      header: t('amount'),
      render: (item) => formatAmount(item, item.amount),
    },
    {
      key: 'totalAmount',
      header: t('totalAmount'),
      render: (item) => formatAmount(item, item.totalAmount),
    },
    {
      key: 'isPaid',
      header: t('isPaid'),
      render: (item) => (
        <Badge variant={item.isPaid ? 'success' : 'secondary'}>
          {item.isPaid ? tCommon('yes') : tCommon('no')}
        </Badge>
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
            aria-label={`${tCommon('edit')} ${item.deductionType}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
            aria-label={`${tCommon('delete')} ${item.deductionType}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={deductions}
      columns={columns}
      loading={loading}
      emptyMessage={t('noDeductions')}
    />
  );
}
