'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { employeesApi } from '../api/employees.api';
import { EmployeesTable } from '../presenters/EmployeesTable';
import { EmployeeFormModal } from '../components/EmployeeFormModal';
import { Pagination } from '@/shared/molecules/Pagination';
import { ConfirmDialog } from '@/shared/molecules/ConfirmDialog';
import { SearchBar } from '@/shared/molecules/SearchBar';
import { usePagination } from '@/shared/hooks/usePagination';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useToast } from '@/shared/hooks/useToast';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { Button } from '@/shared/atoms/Button';
import { EmployeeListItem, EmployeesQueryParams } from '../types/employee.types';
import { EmployeeFormData } from '@/validators/employee.schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/atoms/Select';

export interface EmployeesContainerProps {
  locale: string;
}

export function EmployeesContainer({ locale }: EmployeesContainerProps) {
  const companyId = useCompanyId();
  const [search, setSearch] = React.useState('');
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = React.useState<number | null>(null);
  const [deleteEmployee, setDeleteEmployee] = React.useState<EmployeeListItem | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());

  const debouncedSearch = useDebounce(search, 500);
  const { page, pageSize, setPage, setPageSize } = usePagination();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('employees');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const queryParams: EmployeesQueryParams = {
    page,
    pageSize,
    search: debouncedSearch,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-employees', companyId, queryParams],
    queryFn: () => employeesApi.list(companyId!, queryParams),
    enabled: !!companyId,
  });

  const { data: editingEmployee, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ['company-employee', companyId, editingEmployeeId],
    queryFn: () => employeesApi.getById(companyId!, editingEmployeeId!),
    enabled: !!companyId && !!editingEmployeeId && formOpen,
  });

  const tableRows = data?.data ?? [];

  const createMutation = useMutation({
    mutationFn: (payload: EmployeeFormData) =>
      employeesApi.create(companyId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-employees', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-employees-all', companyId] });
      toast({ title: t('createSuccess'), variant: 'default' });
      setFormOpen(false);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('createError'),
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: EmployeeFormData) =>
      employeesApi.update(companyId!, editingEmployeeId!, {
        ...payload,
        id: editingEmployeeId!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-employees', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-employees-all', companyId] });
      queryClient.invalidateQueries({
        queryKey: ['company-employee', companyId, editingEmployeeId],
      });
      queryClient.invalidateQueries({
        queryKey: ['company-employee-detail', companyId, editingEmployeeId],
      });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
      setEditingEmployeeId(null);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('updateError'),
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeesApi.remove(companyId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-employees', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-employees-all', companyId] });
      toast({ title: t('deleteSuccess'), variant: 'default' });
      setDeleteEmployee(null);
      setSelectedIds(new Set());
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('deleteError'),
        variant: 'destructive',
      });
    },
  });

  const handleSelect = (id: number, selected: boolean) => {
    const newSelected = new Set(selectedIds);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(tableRows.map((emp) => emp.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleView = (employee: EmployeeListItem) => {
    router.push(`/${locale}/employees/${employee.id}`);
  };

  const handleCreate = () => {
    setEditingEmployeeId(null);
    setFormOpen(true);
  };

  const handleEdit = (employee: EmployeeListItem) => {
    setEditingEmployeeId(employee.id);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: EmployeeFormData) => {
    if (editingEmployeeId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingEmployeeId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteEmployee) {
      deleteMutation.mutate(deleteEmployee.id);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setPageSize(Number(value));
    setPage(1);
    setSelectedIds(new Set());
  };

  if (!companyId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {tCommon('noCompanyInSession')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          placeholder={t('searchPlaceholder')}
          value={search}
          onSearchChange={setSearch}
          className="sm:max-w-md"
        />
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addEmployee')}
        </Button>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {t('loadError')}
        </div>
      ) : (
        <>
          <EmployeesTable
            employees={tableRows}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={(employee) => setDeleteEmployee(employee)}
            loading={isLoading}
          />

          {data && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t('itemsPerPage')}:</span>
                <Select value={String(pageSize)} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      <EmployeeFormModal
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        companyId={companyId}
        employee={editingEmployeeId ? editingEmployee : null}
        loadingEmployee={editingEmployeeId ? isLoadingEmployee : false}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteEmployee}
        onOpenChange={(open) => !open && setDeleteEmployee(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteEmployee')}
        description={t('deleteConfirm', {
          name: deleteEmployee?.fullName ?? '',
        })}
        variant="destructive"
        loading={deleteMutation.isPending}
        confirmText={tCommon('yes')}
        cancelText={tCommon('no')}
      />
    </div>
  );
}
