'use client';

import * as React from 'react';
import { MoreVertical, ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { Button } from '@/shared/atoms/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/atoms/DropdownMenu';
import { Order } from '../types/order.types';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

export interface OrdersTableProps {
  orders: Order[];
  selectedIds: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (order: Order) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
}

export function OrdersTable({
  orders,
  selectedIds,
  onSelect,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  onSort,
  loading = false,
}: OrdersTableProps) {
  const t = useTranslations('orders');
  const tCommon = useTranslations('common');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const allSelected = orders.length > 0 && orders.every((o) => selectedIds.has(String(o.id)));

  const handleSort = (key: string) => {
    if (!onSort) return;

    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
    onSort(key, newDirection);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">{tCommon('loading')}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">{t('noOrders')}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50">
            {/* Order number + checkbox */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  aria-label="Select all"
                />
                <span
                  className={cn('cursor-pointer select-none', onSort && 'flex items-center gap-1')}
                  onClick={() => onSort && handleSort('orderNumber')}
                >
                  {t('orderNumber')}
                  {onSort && <ArrowUpDown className="h-3 w-3 inline-block ml-1" />}
                </span>
              </div>
            </th>

            {/* FIN code */}
            <th
              className={cn(
                'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                onSort && 'cursor-pointer select-none',
              )}
              onClick={() => onSort && handleSort('finCode')}
            >
              <div className="flex items-center gap-1">
                {t('finCode')}
                {onSort && <ArrowUpDown className="h-3 w-3" />}
              </div>
            </th>

            {/* Employee */}
            <th
              className={cn(
                'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                onSort && 'cursor-pointer select-none',
              )}
              onClick={() => onSort && handleSort('employeeName')}
            >
              <div className="flex items-center gap-1">
                {t('employee')}
                {onSort && <ArrowUpDown className="h-3 w-3" />}
              </div>
            </th>

            {/* Start date */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('startDate')}
            </th>

            {/* End date */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('endDate')}
            </th>

            {/* Contract end date */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('contractEndDate')}
            </th>

            {/* Structure */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('structure')}
            </th>

            {/* Position */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('position')}
            </th>

            {/* Branch */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('branch')}
            </th>

            {/* Actions */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {tCommon('actions')}
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {orders.map((order) => {
            const isSelected = selectedIds.has(String(order.id));

            return (
              <tr
                key={order.id}
                className={cn(
                  'border-b transition-colors hover:bg-muted/50',
                  isSelected && 'bg-muted/30',
                )}
              >
                {/* Order number + checkbox */}
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => onSelect(String(order.id), checked as boolean)}
                      aria-label={`Select ${order.orderNumber}`}
                    />
                    <div className="font-medium">{order.orderNumber}</div>
                  </div>
                </td>

                {/* FIN code */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{order.finCode}</div>
                </td>

                {/* Employee */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{order.employeeName}</div>
                </td>

                {/* Start date */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{order.startDate}</div>
                </td>

                {/* End date */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{order.endDate}</div>
                </td>

                {/* Contract end date */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{order.contractEndDate}</div>
                </td>

                {/* Structure */}
                <td className="p-4 align-middle">
                  <div className="text-sm text-muted-foreground max-w-xs truncate">
                    {order.structure}
                  </div>
                </td>

                {/* Position */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{order.position}</div>
                </td>

                {/* Branch */}
                <td className="p-4 align-middle">
                  <div className="text-sm text-muted-foreground max-w-xs truncate">
                    {order.branch}
                  </div>
                </td>

                {/* Actions */}
                <td className="p-4 align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(order)}>
                          {tCommon('view')}
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(order)}>
                          {tCommon('edit')}
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(order)}
                          className="text-destructive"
                        >
                          {tCommon('delete')}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


