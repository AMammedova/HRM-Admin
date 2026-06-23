'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { companyPdfSignaturesApi } from '../api/company-pdf-signatures.api';
import { CompanyPdfSignaturesTable } from '../presenters/CompanyPdfSignaturesTable';
import { CompanyPdfSignatureFormModal } from '../components/CompanyPdfSignatureFormModal';
import { Pagination } from '@/shared/molecules/Pagination';
import { ConfirmDialog } from '@/shared/molecules/ConfirmDialog';
import { usePagination } from '@/shared/hooks/usePagination';
import { useToast } from '@/shared/hooks/useToast';
import { useCompanyId } from '@/shared/hooks/useCompanyId';
import { Button } from '@/shared/atoms/Button';
import {
  CompanyPdfSignature,
  CompanyPdfSignaturesQueryParams,
} from '../types/company-pdf-signature.types';
import { CompanyPdfSignatureFormData } from '@/validators/company-pdf-signature.schema';

export interface CompanyPdfSignaturesContainerProps {
  locale: string;
}

export function CompanyPdfSignaturesContainer({
  locale: _locale,
}: CompanyPdfSignaturesContainerProps) {
  const companyId = useCompanyId();
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingSignature, setEditingSignature] = React.useState<CompanyPdfSignature | null>(
    null
  );
  const [deleteSignature, setDeleteSignature] = React.useState<CompanyPdfSignature | null>(null);

  const { page, pageSize, setPage } = usePagination();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('companyPdfSignatures');
  const tCommon = useTranslations('common');

  const queryParams: CompanyPdfSignaturesQueryParams = {
    page,
    pageSize,
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-pdf-signatures', companyId, queryParams],
    queryFn: () => companyPdfSignaturesApi.list(companyId!, queryParams),
    enabled: !!companyId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CompanyPdfSignatureFormData & { content: string }) =>
      companyPdfSignaturesApi.create(companyId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-pdf-signatures', companyId] });
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
    mutationFn: (payload: CompanyPdfSignatureFormData & { content: string }) =>
      companyPdfSignaturesApi.update(companyId!, editingSignature!.id, {
        ...payload,
        id: editingSignature!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-pdf-signatures', companyId] });
      toast({ title: t('updateSuccess'), variant: 'default' });
      setFormOpen(false);
      setEditingSignature(null);
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
    mutationFn: (id: number) => companyPdfSignaturesApi.remove(companyId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-pdf-signatures', companyId] });
      toast({ title: t('deleteSuccess'), variant: 'default' });
      setDeleteSignature(null);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: t('deleteError'),
        variant: 'destructive',
      });
    },
  });

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortBy(key);
    setSortOrder(direction);
  };

  const handleCreate = () => {
    setEditingSignature(null);
    setFormOpen(true);
  };

  const handleEdit = (signature: CompanyPdfSignature) => {
    setEditingSignature(signature);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: CompanyPdfSignatureFormData & { content: string }) => {
    if (editingSignature) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteSignature) {
      deleteMutation.mutate(deleteSignature.id);
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('createSignature')}
        </Button>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {t('loadError')}
        </div>
      ) : (
        <>
          <CompanyPdfSignaturesTable
            signatures={data?.data || []}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={setDeleteSignature}
            onSort={handleSort}
          />

          {data && (
            <div className="flex justify-center">
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      <CompanyPdfSignatureFormModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingSignature(null);
        }}
        companyId={companyId}
        signature={editingSignature}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteSignature}
        onOpenChange={(open) => !open && setDeleteSignature(null)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteSignature')}
        description={t('deleteConfirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
