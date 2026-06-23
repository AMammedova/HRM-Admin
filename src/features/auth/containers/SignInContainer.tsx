'use client';

import * as React from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { SignInForm } from '../presenters/SignInForm';
import { useLogin } from '../hooks/useLogin';
import { useToast } from '@/shared/hooks/useToast';
import type { SignInFormData } from '@/features/auth/schemas/auth.schema';

export function SignInContainer() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('auth');

  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (data: SignInFormData) => {
    login(data, {
      onSuccess: (response) => {
        toast({ title: t('signInSuccess'), variant: 'default' });

        if (response.requiresCompanySelection) {
          router.push('/select-company');
        } else {
          router.push('/dashboard');
        }
      },
      onError: (err) => {
        toast({
          title: t('signInError'),
          description: err.message,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <SignInForm
      onSubmit={handleSubmit}
      loading={isPending}
      error={error?.message ?? ''}
    />
  );
}
