'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/atoms/Dialog';
import { Button } from '@/shared/atoms/Button';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { Label } from '@/shared/atoms/Label';
import { FormField } from '@/shared/molecules/FormField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/atoms/Tabs';
import {
  orgChartLineSchema,
  OrgChartLineFormData,
  defaultOrgChartLineTranslations,
} from '@/validators/org-chart-line.schema';
import { OrgChartLine, OrgChartLineTranslation } from '../types/org-chart-line.types';

function normalizeTranslations(
  translations: OrgChartLineTranslation[]
): OrgChartLineFormData['translations'] {
  const defaults = defaultOrgChartLineTranslations();
  return defaults.map((def) => {
    const found = translations.find((tr) => tr.languageCode === def.languageCode);
    return found ? { languageCode: def.languageCode, name: found.name } : def;
  });
}

export interface OrgChartLineFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  orgChartLine?: OrgChartLine | null;
  loadingOrgChartLine?: boolean;
  onSubmit: (data: OrgChartLineFormData) => void;
  loading?: boolean;
}

const LANGUAGE_TABS = ['az', 'en', 'ru'] as const;

export function OrgChartLineFormModal({
  open,
  onOpenChange,
  companyId,
  orgChartLine,
  loadingOrgChartLine = false,
  onSubmit,
  loading = false,
}: OrgChartLineFormModalProps) {
  const t = useTranslations('orgChartLines');
  const tCommon = useTranslations('common');
  const isEdit = !!orgChartLine;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<OrgChartLineFormData>({
    resolver: zodResolver(orgChartLineSchema),
    defaultValues: {
      companyId,
      code: '',
      isVisible: true,
      translations: defaultOrgChartLineTranslations(),
    },
  });

  const translations = watch('translations');

  const getTranslationIndex = (lang: (typeof LANGUAGE_TABS)[number]) =>
    translations.findIndex((tr) => tr.languageCode === lang);

  React.useEffect(() => {
    if (!open) return;

    if (orgChartLine) {
      reset({
        companyId: orgChartLine.companyId,
        code: orgChartLine.code,
        isVisible: orgChartLine.isVisible,
        translations: normalizeTranslations(orgChartLine.translations),
      });
    } else {
      reset({
        companyId,
        code: '',
        isVisible: true,
        translations: defaultOrgChartLineTranslations(),
      });
    }
  }, [open, orgChartLine, companyId, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('editOrgChartLine') : t('createOrgChartLine')}
          </DialogTitle>
        </DialogHeader>

        {loadingOrgChartLine ? (
          <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('companyId', { valueAsNumber: true })} />

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
                      <input
                        type="hidden"
                        {...register(`translations.${index}.languageCode`)}
                      />
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

            <div className="flex items-center gap-3">
              <Controller
                name="isVisible"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="orgChartLineIsVisible"
                    checked={field.value}
                    disabled={loading}
                    onCheckedChange={(value) => field.onChange(value === true)}
                  />
                )}
              />
              <Label htmlFor="orgChartLineIsVisible" className="cursor-pointer">
                {t('isVisible')}
              </Label>
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
