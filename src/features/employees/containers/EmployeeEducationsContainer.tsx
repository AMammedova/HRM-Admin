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
import { employeeEducationsApi } from '../api/employee-educations.api';
import { employeesApi } from '../api/employees.api';
import { EmployeeEducationsTable } from '../presenters/EmployeeEducationsTable';
import { EmployeeEducationFormModal } from '../components/EmployeeEducationFormModal';
import { getEmployeeTranslation } from '../types/employee.types';
import { EmployeeEducation } from '../types/employee-education.types';
import { EmployeeEducationFormData } from '@/validators/employee-education.schema';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { useToast } from '@/shared/hooks/useToast';

export interface EmployeeEducationsContainerProps {
  employeeId: number;
  locale: string;
}

export function EmployeeEducationsContainer({
  employeeId,
  locale,
}: EmployeeEducationsContainerProps) {
  const companyId = useCompanyId();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('employeeEducations');
  const tEmployees = useTranslations('employees');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingEducation, setEditingEducation] = React.useState<EmployeeEducation | null>(null);
  const [deleteEducation, setDeleteEducation] = React.useState<EmployeeEducation | null>(null);

  const { data: employee } = useQuery({
    queryKey: ['company-employee', companyId, employeeId],
    queryFn: () => employeesApi.getById(companyId!, employeeId),
    enabled: !!companyId && !!employeeId,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['employee-educations', companyId, employeeId],
    queryFn: () => employeeEducationsApi.list(companyId!, employeeId),
    enabled: !!companyId && !!employeeId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: EmployeeEducationFormData) =>
      employeeEducationsApi.create(companyId!, employeeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-educations', companyId, employeeId] });
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
    mutationFn: (payload: EmployeeEducationFormData) =>
      employeeEducationsApi.update(companyId!, employeeId, editingEducation!.id, {
        ...payload,
        id: editingEducation!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-educations', companyId, employeeId] });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
      setEditingEducation(null);
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
    mutationFn: (id: number) => employeeEducationsApi.remove(companyId!, employeeId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-educations', companyId, employeeId] });
      toast({ title: t('deleteSuccess'), variant: 'default' });
      setDeleteEducation(null);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('deleteError'),
        variant: 'destructive',
      });
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
    setEditingEducation(null);
    setFormOpen(true);
  };

  const handleEdit = (education: EmployeeEducation) => {
    setEditingEducation(education);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: EmployeeEducationFormData) => {
    if (editingEducation) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingEducation(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteEducation) {
      deleteMutation.mutate(deleteEducation.id);
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
            {t('createEducation')}
          </Button>
        </div>

        {isError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            {t('loadError')}
          </div>
        ) : (
          <EmployeeEducationsTable
            educations={data ?? []}
            loading={isLoading}
            locale={locale}
            onEdit={handleEdit}
            onDelete={setDeleteEducation}
          />
        )}
      </div>

      <EmployeeEducationFormModal
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        companyId={companyId}
        employeeId={employeeId}
        education={editingEducation}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteEducation}
        onOpenChange={(open) => !open && setDeleteEducation(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteEducation')}
        description={t('deleteConfirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
