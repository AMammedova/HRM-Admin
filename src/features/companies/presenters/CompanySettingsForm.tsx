'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/atoms/Button';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { Label } from '@/shared/atoms/Label';
import { FormField } from '@/shared/molecules/FormField';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/atoms/Card';
import {
  companySettingsSchema,
  CompanySettingsFormData,
} from '@/validators/company-settings.schema';
import { CompanySettings } from '../types/company-settings.types';

export interface CompanySettingsFormProps {
  companyId: number;
  initialData?: CompanySettings;
  onSubmit: (data: CompanySettingsFormData) => void;
  loading?: boolean;
  loadingSettings?: boolean;
}

function SettingToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <div className="space-y-1">
        <Label htmlFor={id} className="cursor-pointer font-medium">
          {label}
        </Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

export function CompanySettingsForm({
  companyId,
  initialData,
  onSubmit,
  loading = false,
  loadingSettings = false,
}: CompanySettingsFormProps) {
  const t = useTranslations('companySettings');
  const tCommon = useTranslations('common');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CompanySettingsFormData>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: { companyId },
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register('companyId', { valueAsNumber: true })} />

      {loadingSettings ? (
        <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{t('overtimeSection')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="isManualOvertimeEnabled"
                control={control}
                render={({ field }) => (
                  <SettingToggle
                    id="isManualOvertimeEnabled"
                    label={t('isManualOvertimeEnabled')}
                    description={t('isManualOvertimeEnabledDesc')}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('employeeSection')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Controller
                name="isAutoEmployeeCodeEnabled"
                control={control}
                render={({ field }) => (
                  <SettingToggle
                    id="isAutoEmployeeCodeEnabled"
                    label={t('isAutoEmployeeCodeEnabled')}
                    description={t('isAutoEmployeeCodeEnabledDesc')}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                )}
              />
              <FormField
                label={t('employeeCodeSymbolSize')}
                type="number"
                min={1}
                max={20}
                error={errors.employeeCodeSymbolSize?.message}
                disabled={loading}
                {...register('employeeCodeSymbolSize', { valueAsNumber: true })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('timesheetSection')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="isTimesheetExternalFileEnabled"
                control={control}
                render={({ field }) => (
                  <SettingToggle
                    id="isTimesheetExternalFileEnabled"
                    label={t('isTimesheetExternalFileEnabled')}
                    description={t('isTimesheetExternalFileEnabledDesc')}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('payrollSection')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="isServiceChargeEnabled"
                control={control}
                render={({ field }) => (
                  <SettingToggle
                    id="isServiceChargeEnabled"
                    label={t('isServiceChargeEnabled')}
                    description={t('isServiceChargeEnabledDesc')}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('vacationSection')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Controller
                name="isVacationAutoProlongEnabled"
                control={control}
                render={({ field }) => (
                  <SettingToggle
                    id="isVacationAutoProlongEnabled"
                    label={t('isVacationAutoProlongEnabled')}
                    description={t('isVacationAutoProlongEnabledDesc')}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                )}
              />
              <Controller
                name="isVacationIndexEnabled"
                control={control}
                render={({ field }) => (
                  <SettingToggle
                    id="isVacationIndexEnabled"
                    label={t('isVacationIndexEnabled')}
                    description={t('isVacationIndexEnabledDesc')}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('workingTimeSection')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="isWorkingTimeEnabled"
                control={control}
                render={({ field }) => (
                  <SettingToggle
                    id="isWorkingTimeEnabled"
                    label={t('isWorkingTimeEnabled')}
                    description={t('isWorkingTimeEnabledDesc')}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? tCommon('loading') : tCommon('save')}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
