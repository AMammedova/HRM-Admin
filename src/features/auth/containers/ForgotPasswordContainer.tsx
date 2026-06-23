'use client';

import * as React from 'react';
import { isAxiosError } from 'axios';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/atoms/Card';
import { ForgotPasswordEmailForm } from '../presenters/ForgotPasswordEmailForm';
import { VerifyOtpForm } from '../presenters/VerifyOtpForm';
import { ResetPasswordForm } from '../presenters/ResetPasswordForm';
import { useForgotPassword, useVerifyOtp, useResetPassword } from '../hooks/useForgotPassword';
import { useToast } from '@/shared/hooks/useToast';
import type {
  ForgotPasswordFormData,
  ResetPasswordFormData,
  VerifyOtpFormData,
} from '@/features/auth/schemas/auth.schema';

type Step = 'email' | 'otp' | 'password' | 'success';

function getErrorMessage(error: Error): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
  }
  return error.message || 'Unknown error';
}

export function ForgotPasswordContainer() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('auth');

  const [step, setStep] = React.useState<Step>('email');
  const [email, setEmail] = React.useState('');
  const [resetToken, setResetToken] = React.useState('');

  const { mutate: sendOtp, isPending: isSendingOtp } = useForgotPassword();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();

  const handleForgotPassword = (data: ForgotPasswordFormData) => {
    sendOtp(data, {
      onSuccess: () => {
        setEmail(data.email);
        setStep('otp');
        toast({ title: t('otpSentSuccess') });
      },
      onError: (err) => {
        toast({
          title: t('otpSentError'),
          description: getErrorMessage(err),
          variant: 'destructive',
        });
      },
    });
  };

  const handleResendOtp = () => {
    if (!email) return;

    sendOtp(
      { email },
      {
        onSuccess: () => toast({ title: t('otpSentSuccess') }),
        onError: (err) => {
          toast({
            title: t('otpSentError'),
            description: getErrorMessage(err),
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleVerifyOtp = (data: VerifyOtpFormData) => {
    verifyOtp(data, {
      onSuccess: (response) => {
        setResetToken(response.resetToken);
        setStep('password');
        toast({ title: t('otpVerifiedSuccess') });
      },
      onError: (err) => {
        toast({
          title: t('otpVerifiedError'),
          description: getErrorMessage(err),
          variant: 'destructive',
        });
      },
    });
  };

  const handleResetPassword = (data: ResetPasswordFormData) => {
    resetPassword(
      {
        resetToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          setStep('success');
          toast({ title: t('resetPasswordSuccess') });
        },
        onError: (err) => {
          toast({
            title: t('resetPasswordError'),
            description: getErrorMessage(err),
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('email');
      return;
    }
    if (step === 'password') {
      setStep('otp');
    }
  };

  return (
    <div className="space-y-4">
      {step === 'email' && (
        <ForgotPasswordEmailForm onSubmit={handleForgotPassword} loading={isSendingOtp} />
      )}

      {step === 'otp' && (
        <VerifyOtpForm
          email={email}
          onSubmit={handleVerifyOtp}
          onResend={handleResendOtp}
          loading={isVerifyingOtp}
          resendLoading={isSendingOtp}
        />
      )}

      {step === 'password' && (
        <ResetPasswordForm onSubmit={handleResetPassword} loading={isResetting} />
      )}

      {step === 'success' && (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{t('resetPasswordSuccessTitle')}</CardTitle>
            <CardDescription>{t('resetPasswordSuccessDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => router.push('/sign-in')}>
              {t('backToSignIn')}
            </Button>
          </CardContent>
        </Card>
      )}

      {step !== 'success' && (
        <div className="flex items-center justify-between text-sm">
          {step !== 'email' ? (
            <button
              type="button"
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground"
            >
              {t('back')}
            </button>
          ) : (
            <span />
          )}
          <Link href="/sign-in" className="text-primary hover:underline">
            {t('backToSignIn')}
          </Link>
        </div>
      )}
    </div>
  );
}
