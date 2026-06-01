'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/atoms/Card';
import { FormField } from '@/shared/molecules/FormField';
import {
  verifyOtpFormSchema,
  type VerifyOtpFormData,
} from '@/features/auth/schemas/auth.schema';

export interface VerifyOtpFormProps {
  email: string;
  onSubmit: (data: VerifyOtpFormData) => void;
  onResend: () => void;
  loading?: boolean;
  resendLoading?: boolean;
}

export function VerifyOtpForm({
  email,
  onSubmit,
  onResend,
  loading = false,
  resendLoading = false,
}: VerifyOtpFormProps) {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpFormSchema),
    defaultValues: { email, otp: '' },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('verifyOtpTitle')}</CardTitle>
        <CardDescription>{t('verifyOtpDescription', { email })}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('email')} />

          <FormField
            label={t('otp')}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            error={errors.otp?.message ? t(errors.otp.message as never) : undefined}
            {...register('otp')}
          />

          <p className="text-xs text-muted-foreground">{t('otpExpiryHint')}</p>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? tCommon('loading') : t('verifyOtp')}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={resendLoading || loading}
            onClick={onResend}
          >
            {resendLoading ? tCommon('loading') : t('resendOtp')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
