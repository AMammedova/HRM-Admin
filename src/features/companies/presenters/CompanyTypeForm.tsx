'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/atoms/Button';
import { FormField } from '@/shared/molecules/FormField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/atoms/Tabs';
import {
  companyTypeSchema,
  CompanyTypeFormData,
  defaultCompanyTypeTranslations,
} from '@/validators/company-type.schema';
import { CompanyType } from '../types/company-type.types';

export interface CompanyTypeFormProps {
  initialData?: CompanyType;
  onSubmit: (data: CompanyTypeFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const LANGUAGE_TABS = ['az', 'en', 'ru'] as const;

export function CompanyTypeForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: CompanyTypeFormProps) {
  const t = useTranslations('companyTypes');
  const tCommon = useTranslations('common');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CompanyTypeFormData>({
    resolver: zodResolver(companyTypeSchema),
    defaultValues: initialData
      ? {
          code: initialData.code,
          sortOrder: initialData.sortOrder,
          translations: initialData.translations.length
            ? initialData.translations
            : defaultCompanyTypeTranslations(),
        }
      : {
          translations: defaultCompanyTypeTranslations(),
        },
  });

  const translations = watch('translations');

  const getTranslationIndex = (lang: (typeof LANGUAGE_TABS)[number]) =>
    translations.findIndex((tr) => tr.languageCode === lang);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label={t('code')}
          placeholder="FULL_TIME"
          error={errors.code?.message}
          {...register('code')}
        />
        {initialData && (
          <FormField
            label={t('sortOrder')}
            type="number"
            min={0}
            error={errors.sortOrder?.message}
            {...register('sortOrder', { valueAsNumber: true })}
          />
        )}
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
              </TabsContent>
            );
          })}
        </Tabs>
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
