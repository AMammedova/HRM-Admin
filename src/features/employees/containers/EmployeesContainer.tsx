'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { EmployeesTable } from '../presenters/EmployeesTable';
import { mockEmployees } from '../data/mock-employees';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types/employee.types';
import { Card, CardContent } from '@/shared/atoms/Card';
import { Pagination } from '@/shared/molecules/Pagination';
import { Button } from '@/shared/atoms/Button';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/atoms/Select';
import { useTranslations } from 'next-intl';
import { ConfirmDialog } from '@/shared/molecules/ConfirmDialog';
import { EmployeeFormModal } from '../components/EmployeeFormModal';
import { useToast } from '@/shared/hooks/useToast';


export interface EmployeesContainerProps {
  locale: string;
}

export function EmployeesContainer({ locale }: EmployeesContainerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('employees');
  const tCommon = useTranslations('common');

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [employeeToDelete, setEmployeeToDelete] = React.useState<Employee | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Calculate pagination
  const totalPages = Math.ceil(mockEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = mockEmployees.slice(startIndex, endIndex);

  const handleSelect = (id: string, selected: boolean) => {
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
      setSelectedIds(new Set(paginatedEmployees.map((emp) => String(emp.id))));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleView = (employee: Employee) => {
    router.push(`/${locale}/employees/${employee.id}`);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
  };

  const handleDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      // TODO: Implement actual delete logic
      console.log('Deleting employee:', employeeToDelete.id);
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    // TODO: Implement sorting logic
    console.log('Sorting by:', key, direction);
  };

  const handleCreateEmployee = async (data: CreateEmployeeDto) => {
    try {
      setIsSubmitting(true);
      // TODO: Replace with actual API call
      console.log('Creating employee:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: tCommon('success'),
        description: t('employeeCreated'),
        variant: 'default',
      });
      
      setIsCreateModalOpen(false);
      // TODO: Refresh employee list
    } catch (error) {
      console.error('Error creating employee:', error);
      toast({
        title: tCommon('error'),
        description: tCommon('somethingWentWrong'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEmployee = async (data: UpdateEmployeeDto) => {
    if (!editingEmployee) return;
    
    try {
      setIsSubmitting(true);
      // TODO: Replace with actual API call
      console.log('Updating employee:', editingEmployee.id, data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: tCommon('success'),
        description: t('employeeUpdated'),
        variant: 'default',
      });
      
      setEditingEmployee(null);
      // TODO: Refresh employee list
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: tCommon('error'),
        description: tCommon('somethingWentWrong'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds(new Set()); // Clear selection on page change
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
    setSelectedIds(new Set()); // Clear selection
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('employees')}</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addEmployee')}
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <EmployeesTable
            employees={paginatedEmployees}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSort={handleSort}
          />
        </CardContent>
      </Card>

      {/* Pagination and Items Per Page */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t('itemsPerPage')}:</span>
          <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
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
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('deleteEmployee')}
        description={t('deleteConfirm', {
          name: employeeToDelete
            ? `${employeeToDelete.firstName} ${employeeToDelete.lastName}`
            : '',
        })}
        onConfirm={confirmDelete}
        confirmText={tCommon('yes')}
        cancelText={tCommon('no')}
      />

      {/* Create Employee Modal */}
      <EmployeeFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateEmployee}
        isSubmitting={isSubmitting}
      />

      {/* Edit Employee Modal */}
      <EmployeeFormModal
        open={!!editingEmployee}
        onOpenChange={(open) => !open && setEditingEmployee(null)}
        employee={editingEmployee}
        onSubmit={handleUpdateEmployee}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
