'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/atoms/Dialog';
import { Button } from '@/shared/atoms/Button';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { Label } from '@/shared/atoms/Label';
import { FormField } from '@/shared/molecules/FormField';
import {
  employeeDocumentSchema,
  EmployeeDocumentFormData,
} from '@/validators/employee-document.schema';
import { EmployeeDocument } from '../types/employee-document.types';

export interface EmployeeDocumentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  employeeId: number;
  document?: EmployeeDocument | null;
  onSubmit: (data: EmployeeDocumentFormData) => void;
  loading?: boolean;
}

export function EmployeeDocumentFormModal({
  open,
  onOpenChange,
  companyId,
  employeeId,
  document,
  onSubmit,
  loading = false,
}: EmployeeDocumentFormModalProps) {
  const t = useTranslations('employeeDocuments');
  const tCommon = useTranslations('common');
  const isEdit = !!document;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EmployeeDocumentFormData>({
    resolver: zodResolver(employeeDocumentSchema),
    defaultValues: {
      companyId,
      employeeId,
      documentCode: '',
      hasBeenPresented: false,
    },
  });

  React.useEffect(() => {
    if (!open) return;

    reset(
      document
        ? {
            companyId,
            employeeId,
            documentCode: document.documentCode,
            hasBeenPresented: document.hasBeenPresented,
          }
        : {
            companyId,
            employeeId,
            documentCode: '',
            hasBeenPresented: false,
          }
    );
  }, [open, document, companyId, employeeId, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('editDocument') : t('createDocument')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('companyId', { valueAsNumber: true })} />
          <input type="hidden" {...register('employeeId', { valueAsNumber: true })} />

          <FormField
            label={t('documentCode')}
            error={errors.documentCode?.message}
            disabled={loading}
            {...register('documentCode')}
          />

          <div className="flex items-center gap-3">
            <Controller
              name="hasBeenPresented"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="hasBeenPresented"
                  checked={field.value}
                  disabled={loading}
                  onCheckedChange={(value) => field.onChange(value === true)}
                />
              )}
            />
            <Label htmlFor="hasBeenPresented" className="cursor-pointer">
              {t('hasBeenPresented')}
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {tCommon('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? tCommon('loading') : tCommon('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
