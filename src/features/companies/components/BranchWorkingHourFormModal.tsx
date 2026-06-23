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
  branchWorkingHourSchema,
  BranchWorkingHourFormData,
} from '@/validators/branch-working-hour.schema';
import {
  BranchWorkingHour,
  toApiTime,
  toInputTime,
} from '../types/branch-working-hour.types';

export interface BranchWorkingHourFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  branchId: number;
  workingHour?: BranchWorkingHour | null;
  onSubmit: (data: BranchWorkingHourFormData) => void;
  loading?: boolean;
}

export function BranchWorkingHourFormModal({
  open,
  onOpenChange,
  companyId,
  branchId,
  workingHour,
  onSubmit,
  loading = false,
}: BranchWorkingHourFormModalProps) {
  const t = useTranslations('branchWorkingHours');
  const tCommon = useTranslations('common');
  const isEdit = !!workingHour;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BranchWorkingHourFormData>({
    resolver: zodResolver(branchWorkingHourSchema),
    defaultValues: {
      companyId,
      branchId,
      jobStartTime: '09:00',
      jobEndTime: '18:00',
      lunchStartTime: '13:00',
      lunchEndTime: '14:00',
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (!open) return;

    reset(
      workingHour
        ? {
            companyId,
            branchId,
            jobStartTime: toInputTime(workingHour.jobStartTime),
            jobEndTime: toInputTime(workingHour.jobEndTime),
            lunchStartTime: toInputTime(workingHour.lunchStartTime),
            lunchEndTime: toInputTime(workingHour.lunchEndTime),
            isActive: workingHour.isActive,
          }
        : {
            companyId,
            branchId,
            jobStartTime: '09:00',
            jobEndTime: '18:00',
            lunchStartTime: '13:00',
            lunchEndTime: '14:00',
            isActive: true,
          }
    );
  }, [open, workingHour, companyId, branchId, reset]);

  const handleFormSubmit = (data: BranchWorkingHourFormData) => {
    onSubmit({
      ...data,
      jobStartTime: toApiTime(data.jobStartTime),
      jobEndTime: toApiTime(data.jobEndTime),
      lunchStartTime: toApiTime(data.lunchStartTime),
      lunchEndTime: toApiTime(data.lunchEndTime),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('editWorkingHour') : t('createWorkingHour')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <input type="hidden" {...register('companyId', { valueAsNumber: true })} />
          <input type="hidden" {...register('branchId', { valueAsNumber: true })} />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label={t('jobStartTime')}
              type="time"
              error={errors.jobStartTime?.message}
              disabled={loading}
              {...register('jobStartTime')}
            />
            <FormField
              label={t('jobEndTime')}
              type="time"
              error={errors.jobEndTime?.message}
              disabled={loading}
              {...register('jobEndTime')}
            />
            <FormField
              label={t('lunchStartTime')}
              type="time"
              error={errors.lunchStartTime?.message}
              disabled={loading}
              {...register('lunchStartTime')}
            />
            <FormField
              label={t('lunchEndTime')}
              type="time"
              error={errors.lunchEndTime?.message}
              disabled={loading}
              {...register('lunchEndTime')}
            />
          </div>

          <div className="flex items-center gap-3">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="workingHourIsActive"
                  checked={field.value}
                  disabled={loading}
                  onCheckedChange={(value) => field.onChange(value === true)}
                />
              )}
            />
            <Label htmlFor="workingHourIsActive" className="cursor-pointer">
              {t('active')}
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
