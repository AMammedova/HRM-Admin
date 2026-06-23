'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/atoms/Dialog';
import { Button } from '@/shared/atoms/Button';
import { FormField } from '@/shared/molecules/FormField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/atoms/Tabs';
import {
  businessTravelSettingSchema,
  BusinessTravelSettingFormData,
  defaultBusinessTravelSettingTranslations,
} from '@/validators/business-travel-setting.schema';
import {
  BusinessTravelSetting,
  BusinessTravelSettingTranslation,
} from '../types/business-travel-setting.types';

function normalizeTranslations(
  translations: BusinessTravelSettingTranslation[]
): BusinessTravelSettingFormData['translations'] {
  const defaults = defaultBusinessTravelSettingTranslations();
  return defaults.map((def) => {
    const found = translations.find((tr) => tr.languageCode === def.languageCode);
    return found ? { languageCode: def.languageCode, name: found.name } : def;
  });
}

export interface BusinessTravelSettingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setting?: BusinessTravelSetting | null;
  loadingSetting?: boolean;
  onSubmit: (data: BusinessTravelSettingFormData) => void;
  loading?: boolean;
}

const LANGUAGE_TABS = ['az', 'en', 'ru'] as const;

export function BusinessTravelSettingFormModal({
  open,
  onOpenChange,
  setting,
  loadingSetting = false,
  onSubmit,
  loading = false,
}: BusinessTravelSettingFormModalProps) {
  const t = useTranslations('businessTravelSettings');
  const tCommon = useTranslations('common');
  const isEdit = !!setting;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BusinessTravelSettingFormData>({
    resolver: zodResolver(businessTravelSettingSchema),
    defaultValues: {
      code: '',
      translations: defaultBusinessTravelSettingTranslations(),
    },
  });

  const translations = watch('translations');

  const getTranslationIndex = (lang: (typeof LANGUAGE_TABS)[number]) =>
    translations.findIndex((tr) => tr.languageCode === lang);

  React.useEffect(() => {
    if (!open) return;

    if (setting) {
      reset({
        code: setting.code,
        translations: normalizeTranslations(setting.translations),
      });
    } else {
      reset({
        code: '',
        translations: defaultBusinessTravelSettingTranslations(),
      });
    }
  }, [open, setting, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('editSetting') : t('createSetting')}
          </DialogTitle>
        </DialogHeader>

        {loadingSetting ? (
          <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              label={t('code')}
              placeholder={t('codePlaceholder')}
              error={errors.code?.message}
              disabled={loading}
              {...register('code')}
            />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t('translations')}</h3>
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
                        disabled={loading}
                        {...register(`translations.${index}.name`)}
                      />
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? tCommon('loading') : tCommon('save')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
