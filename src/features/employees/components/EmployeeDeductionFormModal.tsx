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
import { Textarea } from '@/shared/atoms/Textarea';
import { FormField } from '@/shared/molecules/FormField';
import {
  employeeDeductionSchema,
  EmployeeDeductionFormData,
} from '@/validators/employee-deduction.schema';
import {
  EmployeeDeduction,
  toApiDate,
  toInputDate,
} from '../types/employee-deduction.types';

export interface EmployeeDeductionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  employeeId: number;
  deduction?: EmployeeDeduction | null;
  onSubmit: (data: EmployeeDeductionFormData) => void;
  loading?: boolean;
}

export function EmployeeDeductionFormModal({
  open,
  onOpenChange,
  companyId,
  employeeId,
  deduction,
  onSubmit,
  loading = false,
}: EmployeeDeductionFormModalProps) {
  const t = useTranslations('employeeDeductions');
  const tCommon = useTranslations('common');
  const isEdit = !!deduction;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EmployeeDeductionFormData>({
    resolver: zodResolver(employeeDeductionSchema),
    defaultValues: {
      companyId,
      employeeId,
      deductionType: '',
      documentNumber: '',
      startDate: '',
      endDate: '',
      isPercentage: false,
      amount: 0,
      totalAmount: 0,
      description: '',
      isActive: true,
      isPaid: false,
      fileId: 0,
    },
  });

  React.useEffect(() => {
    if (!open) return;

    reset(
      deduction
        ? {
            companyId,
            employeeId,
            deductionType: deduction.deductionType,
            documentNumber: deduction.documentNumber,
            startDate: toInputDate(deduction.startDate),
            endDate: toInputDate(deduction.endDate),
            isPercentage: deduction.isPercentage,
            amount: deduction.amount,
            totalAmount: deduction.totalAmount,
            description: deduction.description,
            isActive: deduction.isActive,
            isPaid: deduction.isPaid,
            fileId: deduction.fileId,
          }
        : {
            companyId,
            employeeId,
            deductionType: '',
            documentNumber: '',
            startDate: '',
            endDate: '',
            isPercentage: false,
            amount: 0,
            totalAmount: 0,
            description: '',
            isActive: true,
            isPaid: false,
            fileId: 0,
          }
    );
  }, [open, deduction, companyId, employeeId, reset]);

  const handleFormSubmit = (data: EmployeeDeductionFormData) => {
    onSubmit({
      ...data,
      startDate: toApiDate(data.startDate),
      endDate: toApiDate(data.endDate),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('editDeduction') : t('createDeduction')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <input type="hidden" {...register('companyId', { valueAsNumber: true })} />
          <input type="hidden" {...register('employeeId', { valueAsNumber: true })} />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label={t('deductionType')}
              error={errors.deductionType?.message}
              disabled={loading}
              {...register('deductionType')}
            />
            <FormField
              label={t('documentNumber')}
              error={errors.documentNumber?.message}
              disabled={loading}
              {...register('documentNumber')}
            />
            <FormField
              label={t('startDate')}
              type="date"
              error={errors.startDate?.message}
              disabled={loading}
              {...register('startDate')}
            />
            <FormField
              label={t('endDate')}
              type="date"
              error={errors.endDate?.message}
              disabled={loading}
              {...register('endDate')}
            />
            <FormField
              label={t('amount')}
              type="number"
              step="0.01"
              error={errors.amount?.message}
              disabled={loading}
              {...register('amount', { valueAsNumber: true })}
            />
            <FormField
              label={t('totalAmount')}
              type="number"
              step="0.01"
              error={errors.totalAmount?.message}
              disabled={loading}
              {...register('totalAmount', { valueAsNumber: true })}
            />
            <FormField
              label={t('fileId')}
              type="number"
              min={0}
              error={errors.fileId?.message}
              disabled={loading}
              {...register('fileId', { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea id="description" rows={3} disabled={loading} {...register('description')} />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Controller
                name="isPercentage"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isPercentage"
                    checked={field.value}
                    disabled={loading}
                    onCheckedChange={(value) => field.onChange(value === true)}
                  />
                )}
              />
              <Label htmlFor="isPercentage" className="cursor-pointer">
                {t('isPercentage')}
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="deductionIsActive"
                    checked={field.value}
                    disabled={loading}
                    onCheckedChange={(value) => field.onChange(value === true)}
                  />
                )}
              />
              <Label htmlFor="deductionIsActive" className="cursor-pointer">
                {t('active')}
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Controller
                name="isPaid"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isPaid"
                    checked={field.value}
                    disabled={loading}
                    onCheckedChange={(value) => field.onChange(value === true)}
                  />
                )}
              />
              <Label htmlFor="isPaid" className="cursor-pointer">
                {t('isPaid')}
              </Label>
            </div>
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
