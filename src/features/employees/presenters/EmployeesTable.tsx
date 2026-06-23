'use client';

import * as React from 'react';
import { MoreVertical } from 'lucide-react';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { Avatar, AvatarFallback } from '@/shared/atoms/Avatar';
import { Badge } from '@/shared/atoms/Badge';
import { Button } from '@/shared/atoms/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/atoms/DropdownMenu';
import {
  EmployeeListItem,
  formatEmployeeDate,
  getInitialsFromFullName,
} from '../types/employee.types';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

export interface EmployeesTableProps {
  employees: EmployeeListItem[];
  selectedIds: Set<number>;
  onSelect: (id: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onView?: (employee: EmployeeListItem) => void;
  onEdit?: (employee: EmployeeListItem) => void;
  onDelete?: (employee: EmployeeListItem) => void;
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
  loading = false,
}: EmployeesTableProps) {
  const t = useTranslations('employees');
  const tCommon = useTranslations('common');

  const allSelected = employees.length > 0 && employees.every((emp) => selectedIds.has(emp.id));

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
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  aria-label="Select all"
                />
                <span>{t('fullName')}</span>
              </div>
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('employeeCode')}
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('birthDate')}
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('gender')}
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {t('status')}
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {tCommon('actions')}
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {employees.map((employee) => {
            const isSelected = selectedIds.has(employee.id);

            return (
              <tr
                key={employee.id}
                className={cn(
                  'border-b transition-colors hover:bg-muted/50',
                  isSelected && 'bg-muted/30'
                )}
              >
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => onSelect(employee.id, checked as boolean)}
                      aria-label={`Select ${employee.fullName}`}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitialsFromFullName(employee.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{employee.fullName}</div>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div className="text-sm">{employee.code}</div>
                </td>
                <td className="p-4 align-middle">
                  <div className="text-sm">{formatEmployeeDate(employee.birthDate)}</div>
                </td>
                <td className="p-4 align-middle">
                  <div className="text-sm">
                    {employee.gender ? t('male') : t('female')}
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <Badge variant={employee.isActive ? 'success' : 'secondary'}>
                    {employee.isActive ? t('active') : t('inactive')}
                  </Badge>
                </td>
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
