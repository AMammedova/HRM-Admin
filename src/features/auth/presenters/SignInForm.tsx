'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/atoms/Card';
import { FormField } from '@/shared/molecules/FormField';
import { signInSchema, SignInFormData } from '@/validators/auth.schema';

export interface SignInFormProps {
  onSubmit: (data: SignInFormData) => void;
  loading?: boolean;
  error?: string;
}

export function SignInForm({ onSubmit, loading = false, error }: SignInFormProps) {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('signIn')}</CardTitle>
        <CardDescription>{tCommon('welcome')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label={t('email')}
            type="email"
            placeholder="admin@hrm.az"
            error={errors.email?.message ? t(errors.email.message as never) : undefined}
            {...register('email')}
          />

          <FormField
            label={t('password')}
            type="password"
            placeholder="••••••"
            error={errors.password?.message ? t(errors.password.message as never) : undefined}
            {...register('password')}
          />

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? tCommon('loading') : t('signIn')}
          </Button>

          <div className="text-sm text-muted-foreground text-center space-y-1">
            <p>Demo credentials:</p>
            <p className="font-mono text-xs">
              Email: admin@hrm.az<br />
              Password: admin123
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

