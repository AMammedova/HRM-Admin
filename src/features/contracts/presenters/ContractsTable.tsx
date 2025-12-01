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
import { Contract } from '../types/contract.types';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

export interface ContractsTableProps {
  contracts: Contract[];
  selectedIds: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onView?: (contract: Contract) => void;
  onEdit?: (contract: Contract) => void;
  onDelete?: (contract: Contract) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
}

export function ContractsTable({
  contracts,
  selectedIds,
  onSelect,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  onSort,
  loading = false,
}: ContractsTableProps) {
  const t = useTranslations('contracts');
  const tCommon = useTranslations('common');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const allSelected = contracts.length > 0 && contracts.every((c) => selectedIds.has(String(c.id)));

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

  if (contracts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">{t('noContracts')}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50">
            {/* Müqavilə nömrəsi + checkbox */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  aria-label="Select all"
                />
                <span
                  className={cn('cursor-pointer select-none', onSort && 'flex items-center gap-1')}
                  onClick={() => onSort && handleSort('contractNumber')}
                >
                  {t('contractNumber')}
                  {onSort && <ArrowUpDown className="h-3 w-3 inline-block ml-1" />}
                </span>
              </div>
            </th>

            {/* FIN kod */}
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

            {/* İşçi */}
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

            {/* İşə qəbul tarixi */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('startDate')}
            </th>

            {/* Müqavilə bitmə tarixi */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('endDate')}
            </th>

            {/* Struktur */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('structure')}
            </th>

            {/* Vəzifə */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('position')}
            </th>

            {/* Filial */}
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
          {contracts.map((contract) => {
            const isSelected = selectedIds.has(String(contract.id));

            return (
              <tr
                key={contract.id}
                className={cn(
                  'border-b transition-colors hover:bg-muted/50',
                  isSelected && 'bg-muted/30',
                )}
              >
                {/* Contract number + checkbox */}
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => onSelect(String(contract.id), checked as boolean)}
                      aria-label={`Select ${contract.contractNumber}`}
                    />
                    <div className="font-medium">{contract.contractNumber}</div>
                  </div>
                </td>

                {/* FIN */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{contract.finCode}</div>
                </td>

                {/* Employee */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{contract.employeeName}</div>
                </td>

                {/* Start date */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{contract.startDate}</div>
                </td>

                {/* End date */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{contract.endDate}</div>
                </td>

                {/* Structure */}
                <td className="p-4 align-middle">
                  <div className="text-sm text-muted-foreground max-w-xs truncate">
                    {contract.structure}
                  </div>
                </td>

                {/* Position */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{contract.position}</div>
                </td>

                {/* Branch */}
                <td className="p-4 align-middle">
                  <div className="text-sm text-muted-foreground max-w-xs truncate">
                    {contract.branch}
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
                        <DropdownMenuItem onClick={() => onView(contract)}>
                          {tCommon('view')}
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(contract)}>
                          {tCommon('edit')}
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(contract)}
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


