'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { SignInForm } from '../presenters/SignInForm';
import { SignInFormData } from '@/validators/auth.schema';
import { useToast } from '@/shared/hooks/useToast';
import { useTranslations } from 'next-intl';

export interface SignInContainerProps {
  locale: string;
}

export function SignInContainer({ locale }: SignInContainerProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('auth');

  const handleSubmit = async (data: SignInFormData) => {
    console.log(data);
    setLoading(true);
    setError('');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For now, just redirect to dashboard without actual authentication
    toast({
      title: t('signInSuccess'),
      variant: 'default',
    });

    router.push(`/${locale}/dashboard`);
    setLoading(false);
  };

  return <SignInForm onSubmit={handleSubmit} loading={loading} error={error} />;
}

