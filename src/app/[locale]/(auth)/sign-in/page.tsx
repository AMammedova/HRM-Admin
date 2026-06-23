import { AuthLayout } from '@/shared/templates/AuthLayout';
import { SignInContainer } from '@/features/auth/containers/SignInContainer';


export default function SignInPage() {
  return (
    <AuthLayout title="HRM Admin" description="Sign in to access your dashboard">
      <SignInContainer />
    </AuthLayout>
  );
}

