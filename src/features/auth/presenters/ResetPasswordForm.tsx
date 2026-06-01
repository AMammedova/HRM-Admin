'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/atoms/Card';
import { FormField } from '@/shared/molecules/FormField';
import {
  resetPasswordFormSchema,
  type ResetPasswordFormData,
} from '@/features/auth/schemas/auth.schema';

export interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => void;
  loading?: boolean;
}

export function ResetPasswordForm({ onSubmit, loading = false }: ResetPasswordFormProps) {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('resetPasswordTitle')}</CardTitle>
        <CardDescription>{t('resetPasswordDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label={t('newPassword')}
            type="password"
            autoComplete="new-password"
            placeholder="••••••"
            error={
              errors.newPassword?.message ? t(errors.newPassword.message as never) : undefined
            }
            {...register('newPassword')}
          />

          <FormField
            label={t('confirmPassword')}
            type="password"
            autoComplete="new-password"
            placeholder="••••••"
            error={
              errors.confirmPassword?.message
                ? t(errors.confirmPassword.message as never)
                : undefined
            }
            {...register('confirmPassword')}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? tCommon('loading') : t('resetPassword')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
