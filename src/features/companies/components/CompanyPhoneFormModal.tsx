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
  companyPhoneSchema,
  CompanyPhoneFormData,
} from '@/validators/company-phone.schema';
import { CompanyPhone } from '../types/company-phone.types';

export interface CompanyPhoneFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  phone?: CompanyPhone | null;
  onSubmit: (data: CompanyPhoneFormData) => void;
  loading?: boolean;
}

export function CompanyPhoneFormModal({
  open,
  onOpenChange,
  companyId,
  phone,
  onSubmit,
  loading = false,
}: CompanyPhoneFormModalProps) {
  const t = useTranslations('companyPhones');
  const tCommon = useTranslations('common');
  const isEdit = !!phone;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CompanyPhoneFormData>({
    resolver: zodResolver(companyPhoneSchema),
    defaultValues: {
      companyId,
      number: '',
      orderNo: 1,
      isFax: false,
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset(
        phone
          ? {
              companyId: phone.companyId,
              number: phone.number,
              orderNo: phone.orderNo,
              isFax: phone.isFax,
              isActive: phone.isActive,
            }
          : {
              companyId,
              number: '',
              orderNo: 1,
              isFax: false,
              isActive: true,
            }
      );
    }
  }, [open, phone, companyId, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('editPhone') : t('createPhone')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('companyId', { valueAsNumber: true })} />

          <FormField
            label={t('number')}
            type="tel"
            placeholder="+994501234567"
            error={errors.number?.message}
            disabled={loading}
            {...register('number')}
          />

          <FormField
            label={t('orderNo')}
            type="number"
            min={0}
            error={errors.orderNo?.message}
            disabled={loading}
            {...register('orderNo', { valueAsNumber: true })}
          />

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Controller
                name="isFax"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isFax"
                    checked={field.value}
                    disabled={loading}
                    onCheckedChange={(value) => field.onChange(value === true)}
                  />
                )}
              />
              <Label htmlFor="isFax" className="cursor-pointer">
                {t('isFax')}
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="phoneIsActive"
                    checked={field.value}
                    disabled={loading}
                    onCheckedChange={(value) => field.onChange(value === true)}
                  />
                )}
              />
              <Label htmlFor="phoneIsActive" className="cursor-pointer">
                {t('active')}
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
