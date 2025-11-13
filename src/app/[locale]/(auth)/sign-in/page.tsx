import { AuthLayout } from '@/shared/templates/AuthLayout';
import { SignInContainer } from '@/features/auth/containers/SignInContainer';


export default function SignInPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <AuthLayout title="HRM Admin" description="Sign in to access your dashboard">
      <SignInContainer locale={locale} />
    </AuthLayout>
  );
}

