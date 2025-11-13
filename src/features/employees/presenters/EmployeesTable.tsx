'use client';

import * as React from 'react';
import { MoreVertical, ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/atoms/Avatar';
import { Button } from '@/shared/atoms/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/atoms/DropdownMenu';
import { Employee } from '../types/employee.types';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

export interface EmployeesTableProps {
  employees: Employee[];
  selectedIds: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onView?: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
}

export function EmployeesTable({
  employees,
  selectedIds,
  onSelect,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  onSort,
  loading = false,
}: EmployeesTableProps) {
  const t = useTranslations('employees');
  const tCommon = useTranslations('common');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const allSelected = employees.length > 0 && employees.every((emp) => selectedIds.has(emp.id));
  const someSelected = employees.some((emp) => selectedIds.has(emp.id));

  const handleSort = (key: string) => {
    if (!onSort) return;

    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
    onSort(key, newDirection);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">{tCommon('loading')}</div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">{t('noEmployees')}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50">
            {/* İşçi column with checkbox */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  aria-label="Select all"
                />
                <span
                  className={cn('cursor-pointer select-none', onSort && 'flex items-center gap-1')}
                  onClick={() => onSort && handleSort('name')}
                >
                  {t('employee')}
                  {onSort && (
                    <ArrowUpDown className="h-3 w-3 inline-block ml-1" />
                  )}
                </span>
              </div>
            </th>

            {/* İşçi kodu */}
            <th
              className={cn(
                'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                onSort && 'cursor-pointer select-none'
              )}
              onClick={() => onSort && handleSort('code')}
            >
              <div className="flex items-center gap-1">
                {t('employeeCode')}
                {onSort && <ArrowUpDown className="h-3 w-3" />}
              </div>
            </th>

            {/* Vəzifə */}
            <th
              className={cn(
                'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                onSort && 'cursor-pointer select-none'
              )}
              onClick={() => onSort && handleSort('position')}
            >
              <div className="flex items-center gap-1">
                {t('position')}
                {onSort && <ArrowUpDown className="h-3 w-3" />}
              </div>
            </th>

            {/* Fillial */}
            <th
              className={cn(
                'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                onSort && 'cursor-pointer select-none'
              )}
              onClick={() => onSort && handleSort('branch')}
            >
              <div className="flex items-center gap-1">
                {t('branch')}
                {onSort && <ArrowUpDown className="h-3 w-3" />}
              </div>
            </th>

            {/* FİN */}
            <th
              className={cn(
                'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                onSort && 'cursor-pointer select-none'
              )}
              onClick={() => onSort && handleSort('fin')}
            >
              <div className="flex items-center gap-1">
                {t('fin')}
                {onSort && <ArrowUpDown className="h-3 w-3" />}
              </div>
            </th>

            {/* Struktur */}
            <th
              className={cn(
                'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                onSort && 'cursor-pointer select-none'
              )}
              onClick={() => onSort && handleSort('structure')}
            >
              <div className="flex items-center gap-1">
                {t('structure')}
                {onSort && <ArrowUpDown className="h-3 w-3" />}
              </div>
            </th>

            {/* Actions */}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {tCommon('actions')}
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {employees.map((employee) => {
            const isSelected = selectedIds.has(employee.id);
            const fullName = `${employee.firstName} ${employee.lastName}`;

            return (
              <tr
                key={employee.id}
                className={cn(
                  'border-b transition-colors hover:bg-muted/50',
                  isSelected && 'bg-muted/30'
                )}
              >
                {/* İşçi with checkbox and avatar */}
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => onSelect(employee.id, checked as boolean)}
                      aria-label={`Select ${fullName}`}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={employee.avatar} alt={fullName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(employee.firstName, employee.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{fullName}</div>
                    </div>
                  </div>
                </td>

                {/* İşçi kodu */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{employee.code}</div>
                </td>

                {/* Vəzifə */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{employee.position}</div>
                </td>

                {/* Fillial */}
                <td className="p-4 align-middle">
                  <div className="text-sm text-muted-foreground">{employee.branch}</div>
                </td>

                {/* FİN */}
                <td className="p-4 align-middle">
                  <div className="text-sm">{employee.fin}</div>
                </td>

                {/* Struktur */}
                <td className="p-4 align-middle">
                  <div className="text-sm text-muted-foreground max-w-xs truncate">
                    {employee.structure}
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
                        <DropdownMenuItem onClick={() => onView(employee)}>
                          {tCommon('view')}
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(employee)}>
                          {tCommon('edit')}
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(employee)}
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

