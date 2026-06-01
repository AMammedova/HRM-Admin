import { AuthLayout } from '@/shared/templates/AuthLayout';
import { ForgotPasswordContainer } from '@/features/auth/containers/ForgotPasswordContainer';

export default function ForgotPasswordPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <AuthLayout title="HRM Admin" description="">
      <ForgotPasswordContainer locale={locale} />
    </AuthLayout>
  );
}
