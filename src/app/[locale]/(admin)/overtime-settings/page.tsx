import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { OvertimeSettingsContainer } from '@/features/overtime-settings/containers/OvertimeSettingsContainer';

export default async function OvertimeSettingsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'overtimeSettings' });

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />
      <OvertimeSettingsContainer locale={locale} />
    </div>
  );
}
