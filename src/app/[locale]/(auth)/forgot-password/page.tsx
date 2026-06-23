import { AuthLayout } from '@/shared/templates/AuthLayout';
import { ForgotPasswordContainer } from '@/features/auth/containers/ForgotPasswordContainer';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="HRM Admin" description="">
      <ForgotPasswordContainer />
    </AuthLayout>
  );
}
