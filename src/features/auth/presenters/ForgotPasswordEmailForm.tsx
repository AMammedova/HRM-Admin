'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/atoms/Card';
import { FormField } from '@/shared/molecules/FormField';
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormData,
} from '@/features/auth/schemas/auth.schema';

export interface ForgotPasswordEmailFormProps {
  onSubmit: (data: ForgotPasswordFormData) => void;
  loading?: boolean;
  defaultEmail?: string;
}

export function ForgotPasswordEmailForm({
  onSubmit,
  loading = false,
  defaultEmail = '',
}: ForgotPasswordEmailFormProps) {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: defaultEmail },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('forgotPasswordTitle')}</CardTitle>
        <CardDescription>{t('forgotPasswordDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label={t('email')}
            type="email"
            autoComplete="email"
            placeholder="admin@hrm.az"
            error={errors.email?.message ? t(errors.email.message as never) : undefined}
            {...register('email')}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? tCommon('loading') : t('sendOtp')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
