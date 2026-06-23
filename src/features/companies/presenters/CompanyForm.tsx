'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/atoms/Button';
import { FormField } from '@/shared/molecules/FormField';
import { Label } from '@/shared/atoms/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/atoms/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/atoms/Tabs';
import { useQuery } from '@tanstack/react-query';
import { companyTypesApi } from '../api/company-types.api';
import {
  companySchema,
  CompanyFormData,
  defaultTranslations,
} from '@/validators/company.schema';
import { Company } from '../types/company.types';

export interface CompanyFormProps {
  initialData?: Company;
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const LANGUAGE_TABS = ['az', 'en', 'ru'] as const;

export function CompanyForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: CompanyFormProps) {
  const t = useTranslations('companies');
  const tCommon = useTranslations('common');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData
      ? {
          compCode: initialData.compCode,
          taxId: initialData.taxId,
          email: initialData.email,
          companyTypeId: initialData.companyTypeId,
          businessTravelSettingId: initialData.businessTravelSettingId,
          overtimeSettingId: initialData.overtimeSettingId,
          timesheetPeriodTypeId: initialData.timesheetPeriodTypeId,
          translations: initialData.translations.length
            ? initialData.translations
            : defaultTranslations(),
        }
      : {
          translations: defaultTranslations(),
        },
  });

  const translations = watch('translations');
  const companyTypeId = watch('companyTypeId');

  const { data: companyTypes = [] } = useQuery({
    queryKey: ['company-types-all'],
    queryFn: () => companyTypesApi.getAll(),
  });

  const activeCompanyTypes = companyTypes.filter((type) => type.isActive);

  const getTranslationIndex = (lang: (typeof LANGUAGE_TABS)[number]) =>
    translations.findIndex((tr) => tr.languageCode === lang);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t('generalInfo')}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label={t('compCode')}
            placeholder="ABC_CORP"
            error={errors.compCode?.message}
            {...register('compCode')}
          />
          <FormField
            label={t('taxId')}
            placeholder="1234567890"
            error={errors.taxId?.message}
            {...register('taxId')}
          />
        </div>

        <FormField
          label={t('email')}
          type="email"
          placeholder="info@company.az"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t('companyType')}</Label>
            <Select
              value={companyTypeId ? String(companyTypeId) : undefined}
              onValueChange={(value) => setValue('companyTypeId', Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('companyTypeId')} />
              </SelectTrigger>
              <SelectContent>
                {activeCompanyTypes.map((type) => (
                  <SelectItem key={type.id} value={String(type.id)}>
                    {type.name} ({type.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.companyTypeId && (
              <p className="text-sm text-destructive">{errors.companyTypeId.message}</p>
            )}
          </div>
          <FormField
            label={t('timesheetPeriodTypeId')}
            type="number"
            placeholder="1"
            error={errors.timesheetPeriodTypeId?.message}
            {...register('timesheetPeriodTypeId', { valueAsNumber: true })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label={t('businessTravelSettingId')}
            type="number"
            placeholder={t('optional')}
            error={errors.businessTravelSettingId?.message}
            {...register('businessTravelSettingId', { valueAsNumber: true })}
          />
          <FormField
            label={t('overtimeSettingId')}
            type="number"
            placeholder={t('optional')}
            error={errors.overtimeSettingId?.message}
            {...register('overtimeSettingId', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t('translations')}</h3>
        <Tabs defaultValue="az">
          <TabsList>
            {LANGUAGE_TABS.map((lang) => (
              <TabsTrigger key={lang} value={lang}>
                {t(`lang.${lang}`)}
              </TabsTrigger>
            ))}
          </TabsList>

          {LANGUAGE_TABS.map((lang) => {
            const index = getTranslationIndex(lang);
            const translationErrors = errors.translations?.[index >= 0 ? index : 0];

            return (
              <TabsContent key={lang} value={lang} className="space-y-4">
                <input type="hidden" {...register(`translations.${index}.languageCode`)} />

                <FormField
                  label={t('name')}
                  placeholder={t('namePlaceholder')}
                  error={translationErrors?.name?.message}
                  {...register(`translations.${index}.name`)}
                />
                <FormField
                  label={t('factAddress')}
                  placeholder={t('addressPlaceholder')}
                  error={translationErrors?.factAddress?.message}
                  {...register(`translations.${index}.factAddress`)}
                />
                <FormField
                  label={t('legalAddress')}
                  placeholder={t('addressPlaceholder')}
                  error={translationErrors?.legalAddress?.message}
                  {...register(`translations.${index}.legalAddress`)}
                />
              </TabsContent>
            );
          })}
        </Tabs>

        {errors.translations?.message && (
          <p className="text-sm text-destructive">{errors.translations.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          {tCommon('cancel')}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? tCommon('loading') : tCommon('save')}
        </Button>
      </div>
    </form>
  );
}
