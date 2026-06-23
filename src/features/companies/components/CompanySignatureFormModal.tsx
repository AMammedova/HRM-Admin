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
  companySignatureSchema,
  CompanySignatureFormData,
} from '@/validators/company-signature.schema';
import { CompanySignature } from '../types/company-signature.types';

export interface CompanySignatureFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  signature?: CompanySignature | null;
  onSubmit: (data: CompanySignatureFormData) => void;
  loading?: boolean;
}

export function CompanySignatureFormModal({
  open,
  onOpenChange,
  companyId,
  signature,
  onSubmit,
  loading = false,
}: CompanySignatureFormModalProps) {
  const t = useTranslations('companySignatures');
  const tCommon = useTranslations('common');
  const isEdit = !!signature;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CompanySignatureFormData>({
    resolver: zodResolver(companySignatureSchema),
    defaultValues: {
      companyId,
      orderNo: 1,
      fullName: '',
      position: '',
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset(
        signature
          ? {
              companyId: signature.companyId,
              orderNo: signature.orderNo,
              fullName: signature.fullName,
              position: signature.position,
              isActive: signature.isActive,
            }
          : {
              companyId,
              orderNo: 1,
              fullName: '',
              position: '',
              isActive: true,
            }
      );
    }
  }, [open, signature, companyId, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('editSignature') : t('createSignature')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('companyId', { valueAsNumber: true })} />

          <FormField
            label={t('orderNo')}
            type="number"
            min={0}
            error={errors.orderNo?.message}
            disabled={loading}
            {...register('orderNo', { valueAsNumber: true })}
          />

          <FormField
            label={t('fullName')}
            placeholder={t('fullNamePlaceholder')}
            error={errors.fullName?.message}
            disabled={loading}
            {...register('fullName')}
          />

          <FormField
            label={t('position')}
            placeholder={t('positionPlaceholder')}
            error={errors.position?.message}
            disabled={loading}
            {...register('position')}
          />

          <div className="flex items-center gap-3">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isActive"
                  checked={field.value}
                  disabled={loading}
                  onCheckedChange={(value) => field.onChange(value === true)}
                />
              )}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
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
