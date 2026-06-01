import { AuthLayout } from '@/shared/templates/AuthLayout';
import { SelectCompanyContainer } from '@/features/auth/containers/SelectCompanyContainer';

export default function SelectCompanyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <AuthLayout title="HRM Admin" description="Select your company">
      <SelectCompanyContainer locale={locale} />
    </AuthLayout>
  );
}
