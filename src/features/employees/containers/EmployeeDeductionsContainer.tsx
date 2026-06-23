'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { Breadcrumb } from '@/shared/molecules/Breadcrumb';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { Button } from '@/shared/atoms/Button';
import { ConfirmDialog } from '@/shared/molecules/ConfirmDialog';
import { employeeDeductionsApi } from '../api/employee-deductions.api';
import { employeesApi } from '../api/employees.api';
import { EmployeeDeductionsTable } from '../presenters/EmployeeDeductionsTable';
import { EmployeeDeductionFormModal } from '../components/EmployeeDeductionFormModal';
import { getEmployeeTranslation } from '../types/employee.types';
import { EmployeeDeduction } from '../types/employee-deduction.types';
import { EmployeeDeductionFormData } from '@/validators/employee-deduction.schema';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { useToast } from '@/shared/hooks/useToast';

export interface EmployeeDeductionsContainerProps {
  employeeId: number;
  locale: string;
}

export function EmployeeDeductionsContainer({
  employeeId,
  locale,
}: EmployeeDeductionsContainerProps) {
  const companyId = useCompanyId();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('employeeDeductions');
  const tEmployees = useTranslations('employees');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingDeduction, setEditingDeduction] = React.useState<EmployeeDeduction | null>(null);
  const [deleteDeduction, setDeleteDeduction] = React.useState<EmployeeDeduction | null>(null);
  const [togglingId, setTogglingId] = React.useState<number | null>(null);

  const { data: employee } = useQuery({
    queryKey: ['company-employee', companyId, employeeId],
    queryFn: () => employeesApi.getById(companyId!, employeeId),
    enabled: !!companyId && !!employeeId,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['employee-deductions', companyId, employeeId],
    queryFn: () => employeeDeductionsApi.list(companyId!, employeeId),
    enabled: !!companyId && !!employeeId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: EmployeeDeductionFormData) =>
      employeeDeductionsApi.create(companyId!, employeeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-deductions', companyId, employeeId] });
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
    mutationFn: (payload: EmployeeDeductionFormData) =>
      employeeDeductionsApi.update(companyId!, employeeId, editingDeduction!.id, {
        ...payload,
        id: editingDeduction!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-deductions', companyId, employeeId] });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
      setEditingDeduction(null);
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
    mutationFn: (id: number) => employeeDeductionsApi.remove(companyId!, employeeId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-deductions', companyId, employeeId] });
      toast({ title: t('deleteSuccess'), variant: 'default' });
      setDeleteDeduction(null);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('deleteError'),
        variant: 'destructive',
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) =>
      employeeDeductionsApi.toggleStatus(companyId!, employeeId, id),
    onMutate: (id) => {
      setTogglingId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-deductions', companyId, employeeId] });
      toast({ title: t('statusUpdateSuccess'), variant: 'default' });
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('statusUpdateError'),
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setTogglingId(null);
    },
  });

  const translation = employee
    ? getEmployeeTranslation(employee.translations, locale)
    : undefined;

  const fullName = translation
    ? `${translation.surname} ${translation.name}`.trim()
    : '';

  const breadcrumbItems = [
    { label: tNav('dashboard'), href: `/${locale}/dashboard` },
    { label: tNav('employees'), href: `/${locale}/employees` },
    { label: fullName || tEmployees('employeeDetails'), href: `/${locale}/employees/${employeeId}` },
    { label: t('title') },
  ];

  const handleCreate = () => {
    setEditingDeduction(null);
    setFormOpen(true);
  };

  const handleEdit = (deduction: EmployeeDeduction) => {
    setEditingDeduction(deduction);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: EmployeeDeductionFormData) => {
    if (editingDeduction) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingDeduction(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteDeduction) {
      deleteMutation.mutate(deleteDeduction.id);
    }
  };

  if (!companyId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {tCommon('noCompanyInSession')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader
          title={t('title')}
          description={fullName || t('description')}
          action={
            <Link href={`/${locale}/employees`}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {tCommon('back')}
              </Button>
            </Link>
          }
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            {t('createDeduction')}
          </Button>
        </div>

        {isError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            {t('loadError')}
          </div>
        ) : (
          <EmployeeDeductionsTable
            deductions={data ?? []}
            loading={isLoading}
            locale={locale}
            togglingId={togglingId}
            onEdit={handleEdit}
            onDelete={setDeleteDeduction}
            onToggleStatus={(deduction) => toggleStatusMutation.mutate(deduction.id)}
          />
        )}
      </div>

      <EmployeeDeductionFormModal
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        companyId={companyId}
        employeeId={employeeId}
        deduction={editingDeduction}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteDeduction}
        onOpenChange={(open) => !open && setDeleteDeduction(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteDeduction')}
        description={t('deleteConfirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
