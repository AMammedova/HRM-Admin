'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/atoms/Dialog';
import { Button } from '@/shared/atoms/Button';
import { FormField } from '@/shared/molecules/FormField';
import {
  employeeEducationSchema,
  EmployeeEducationFormData,
} from '@/validators/employee-education.schema';
import {
  EmployeeEducation,
  toApiDate,
  toInputDate,
} from '../types/employee-education.types';

export interface EmployeeEducationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  employeeId: number;
  education?: EmployeeEducation | null;
  onSubmit: (data: EmployeeEducationFormData) => void;
  loading?: boolean;
}

export function EmployeeEducationFormModal({
  open,
  onOpenChange,
  companyId,
  employeeId,
  education,
  onSubmit,
  loading = false,
}: EmployeeEducationFormModalProps) {
  const t = useTranslations('employeeEducations');
  const tCommon = useTranslations('common');
  const isEdit = !!education;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeEducationFormData>({
    resolver: zodResolver(employeeEducationSchema),
    defaultValues: {
      companyId,
      employeeId,
      organizationCode: '',
      startDate: '',
      endDate: '',
      educationLevelLookupValueId: 0,
      eduDocTypeLookupValueId: 0,
      documentNumber: '',
      profession: '',
    },
  });

  React.useEffect(() => {
    if (!open) return;

    reset(
      education
        ? {
            companyId,
            employeeId,
            organizationCode: education.organizationCode,
            startDate: toInputDate(education.startDate),
            endDate: toInputDate(education.endDate),
            educationLevelLookupValueId: education.educationLevelLookupValueId,
            eduDocTypeLookupValueId: education.eduDocTypeLookupValueId,
            documentNumber: education.documentNumber,
            profession: education.profession,
          }
        : {
            companyId,
            employeeId,
            organizationCode: '',
            startDate: '',
            endDate: '',
            educationLevelLookupValueId: 0,
            eduDocTypeLookupValueId: 0,
            documentNumber: '',
            profession: '',
          }
    );
  }, [open, education, companyId, employeeId, reset]);

  const handleFormSubmit = (data: EmployeeEducationFormData) => {
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
            {isEdit ? t('editEducation') : t('createEducation')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <input type="hidden" {...register('companyId', { valueAsNumber: true })} />
          <input type="hidden" {...register('employeeId', { valueAsNumber: true })} />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label={t('organizationCode')}
              error={errors.organizationCode?.message}
              disabled={loading}
              {...register('organizationCode')}
            />
            <FormField
              label={t('profession')}
              error={errors.profession?.message}
              disabled={loading}
              {...register('profession')}
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
              label={t('educationLevelLookupValueId')}
              type="number"
              min={0}
              error={errors.educationLevelLookupValueId?.message}
              disabled={loading}
              {...register('educationLevelLookupValueId', { valueAsNumber: true })}
            />
            <FormField
              label={t('eduDocTypeLookupValueId')}
              type="number"
              min={0}
              error={errors.eduDocTypeLookupValueId?.message}
              disabled={loading}
              {...register('eduDocTypeLookupValueId', { valueAsNumber: true })}
            />
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
