'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/atoms/Button';
import { FormField } from '@/shared/molecules/FormField';
import { Textarea } from '@/shared/atoms/Textarea';
import { Label } from '@/shared/atoms/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/atoms/Card';
import {
  employeeContactSchema,
  EmployeeContactFormData,
} from '@/validators/employee-contact.schema';
import type { EmployeeContact } from '../types/employee-contact.types';

export interface EmployeeContactFormProps {
  companyId: number;
  employeeId: number;
  initialData?: EmployeeContact;
  onSubmit: (data: EmployeeContactFormData) => void;
  loading?: boolean;
  loadingContact?: boolean;
}

export function EmployeeContactForm({
  companyId,
  employeeId,
  initialData,
  onSubmit,
  loading = false,
  loadingContact = false,
}: EmployeeContactFormProps) {
  const t = useTranslations('employees');
  const tCommon = useTranslations('common');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeContactFormData>({
    resolver: zodResolver(employeeContactSchema),
    defaultValues: {
      companyId,
      employeeId,
      email1: '',
      email2: '',
      phone1: '',
      phone2: '',
      phone3: '',
      phone4: '',
      postIndex: '',
      regAddress: '',
      regAddress2: '',
      liveAddress: '',
      liveAddress2: '',
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register('companyId', { valueAsNumber: true })} />
      <input type="hidden" {...register('employeeId', { valueAsNumber: true })} />

      {loadingContact ? (
        <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{t('contactInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label={t('email1')}
                type="email"
                error={errors.email1?.message}
                {...register('email1')}
              />
              <FormField
                label={t('email2')}
                type="email"
                error={errors.email2?.message}
                {...register('email2')}
              />
              <FormField
                label={t('phone1')}
                error={errors.phone1?.message}
                {...register('phone1')}
              />
              <FormField
                label={t('phone2')}
                error={errors.phone2?.message}
                {...register('phone2')}
              />
              <FormField
                label={t('phone3')}
                error={errors.phone3?.message}
                {...register('phone3')}
              />
              <FormField
                label={t('phone4')}
                error={errors.phone4?.message}
                {...register('phone4')}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('registeredAddress')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label={t('postIndex')}
                error={errors.postIndex?.message}
                {...register('postIndex')}
              />
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="regAddress">{t('regAddress')}</Label>
                <Textarea id="regAddress" rows={3} {...register('regAddress')} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="regAddress2">{t('regAddress2')}</Label>
                <Textarea id="regAddress2" rows={3} {...register('regAddress2')} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('livingAddress')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="liveAddress">{t('liveAddress')}</Label>
                <Textarea id="liveAddress" rows={3} {...register('liveAddress')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="liveAddress2">{t('liveAddress2')}</Label>
                <Textarea id="liveAddress2" rows={3} {...register('liveAddress2')} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? tCommon('loading') : tCommon('save')}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
