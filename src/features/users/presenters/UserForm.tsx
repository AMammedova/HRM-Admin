'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/atoms/Button';
import { FormField } from '@/shared/molecules/FormField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/atoms/Select';
import { Label } from '@/shared/atoms/Label';
import { userSchema, UserFormData } from '@/validators/user.schema';
import { User } from '../types/user.types';

export interface UserFormProps {
  initialData?: User;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function UserForm({ initialData, onSubmit, onCancel, loading = false }: UserFormProps) {
  const t = useTranslations('users');
  const tCommon = useTranslations('common');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData
      ? {
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email,
          phone: initialData.phone,
          role: initialData.role,
          department: initialData.department,
          position: initialData.position,
          status: initialData.status,
        }
      : {
          status: 'active',
        },
  });

  const status = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label={t('firstName')}
          placeholder="Aysel"
          error={errors.firstName?.message}
          {...register('firstName')}
        />

        <FormField
          label={t('lastName')}
          placeholder="Məmmədova"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <FormField
        label={t('email')}
        type="email"
        placeholder="aysel@hrm.az"
        error={errors.email?.message}
        {...register('email')}
      />

      <FormField
        label={t('phone')}
        type="tel"
        placeholder="+994501234567"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label={t('role')}
          placeholder="HR Manager"
          error={errors.role?.message}
          {...register('role')}
        />

        <FormField
          label={t('department')}
          placeholder="Human Resources"
          error={errors.department?.message}
          {...register('department')}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label={t('position')}
          placeholder="Senior Manager"
          error={errors.position?.message}
          {...register('position')}
        />

        <div className="space-y-2">
          <Label>{t('status')}</Label>
          <Select
            value={status}
            onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t('active')}</SelectItem>
              <SelectItem value="inactive">{t('inactive')}</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          {tCommon('cancel')}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? tCommon('loading') : tCommon('save')}
        </Button>
      </div>
    </form>
  );
}

