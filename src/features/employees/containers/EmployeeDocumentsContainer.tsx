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
import { employeeDocumentsApi } from '../api/employee-documents.api';
import { employeesApi } from '../api/employees.api';
import { EmployeeDocumentsTable } from '../presenters/EmployeeDocumentsTable';
import { EmployeeDocumentFormModal } from '../components/EmployeeDocumentFormModal';
import { getEmployeeTranslation } from '../types/employee.types';
import { EmployeeDocument } from '../types/employee-document.types';
import { EmployeeDocumentFormData } from '@/validators/employee-document.schema';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { useToast } from '@/shared/hooks/useToast';

export interface EmployeeDocumentsContainerProps {
  employeeId: number;
  locale: string;
}

export function EmployeeDocumentsContainer({
  employeeId,
  locale,
}: EmployeeDocumentsContainerProps) {
  const companyId = useCompanyId();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('employeeDocuments');
  const tEmployees = useTranslations('employees');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingDocument, setEditingDocument] = React.useState<EmployeeDocument | null>(null);
  const [deleteDocument, setDeleteDocument] = React.useState<EmployeeDocument | null>(null);

  const { data: employee } = useQuery({
    queryKey: ['company-employee', companyId, employeeId],
    queryFn: () => employeesApi.getById(companyId!, employeeId),
    enabled: !!companyId && !!employeeId,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['employee-documents', companyId, employeeId],
    queryFn: () => employeeDocumentsApi.list(companyId!, employeeId),
    enabled: !!companyId && !!employeeId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: EmployeeDocumentFormData) =>
      employeeDocumentsApi.create(companyId!, employeeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-documents', companyId, employeeId] });
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
    mutationFn: (payload: EmployeeDocumentFormData) =>
      employeeDocumentsApi.update(companyId!, employeeId, editingDocument!.id, {
        ...payload,
        id: editingDocument!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-documents', companyId, employeeId] });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
      setEditingDocument(null);
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
    mutationFn: (id: number) => employeeDocumentsApi.remove(companyId!, employeeId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-documents', companyId, employeeId] });
      toast({ title: t('deleteSuccess'), variant: 'default' });
      setDeleteDocument(null);
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
    setEditingDocument(null);
    setFormOpen(true);
  };

  const handleEdit = (document: EmployeeDocument) => {
    setEditingDocument(document);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: EmployeeDocumentFormData) => {
    if (editingDocument) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingDocument(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteDocument) {
      deleteMutation.mutate(deleteDocument.id);
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
            {t('createDocument')}
          </Button>
        </div>

        {isError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            {t('loadError')}
          </div>
        ) : (
          <EmployeeDocumentsTable
            documents={data ?? []}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={setDeleteDocument}
          />
        )}
      </div>

      <EmployeeDocumentFormModal
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        companyId={companyId}
        employeeId={employeeId}
        document={editingDocument}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteDocument}
        onOpenChange={(open) => !open && setDeleteDocument(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteDocument')}
        description={t('deleteConfirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
