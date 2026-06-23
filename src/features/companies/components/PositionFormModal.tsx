'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/atoms/Select';
import {
  positionSchema,
  PositionFormData,
  defaultPositionTranslations,
} from '@/validators/position.schema';
import { Position, PositionTranslation } from '../types/position.types';
import { orgChartLevelsApi } from '../api/org-chart-levels.api';

function normalizeTranslations(
  translations: PositionTranslation[]
): PositionFormData['translations'] {
  const defaults = defaultPositionTranslations();
  return defaults.map((def) => {
    const found = translations.find((tr) => tr.languageCode === def.languageCode);
    return found
      ? { languageCode: def.languageCode, name: found.name, description: found.description ?? '' }
      : def;
  });
}

export interface PositionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  position?: Position | null;
  loadingPosition?: boolean;
  onSubmit: (data: PositionFormData) => void;
  loading?: boolean;
}

const LANGUAGE_TABS = ['az', 'en', 'ru'] as const;

export function PositionFormModal({
  open,
  onOpenChange,
  companyId,
  position,
  loadingPosition = false,
  onSubmit,
  loading = false,
}: PositionFormModalProps) {
  const t = useTranslations('positions');
  const tCommon = useTranslations('common');
  const isEdit = !!position;

  const { data: orgChartLevels = [], isLoading: isLoadingOrgChartLevels } = useQuery({
    queryKey: ['company-org-chart-levels-all', companyId],
    queryFn: () => orgChartLevelsApi.getAll(companyId),
    enabled: !!companyId && open,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<PositionFormData>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      companyId,
      orgChartLevelId: null,
      code: '',
      isActive: true,
      isBlueCollar: false,
      vacationNorm: 21,
      isAccordWorkCondition: false,
      accordWorkConditionDay: 0,
      translations: defaultPositionTranslations(),
    },
  });

  const translations = watch('translations');

  const getTranslationIndex = (lang: (typeof LANGUAGE_TABS)[number]) =>
    translations.findIndex((tr) => tr.languageCode === lang);

  React.useEffect(() => {
    if (!open) return;

    if (position) {
      reset({
        companyId: position.companyId,
        orgChartLevelId: position.orgChartLevelId ?? null,
        code: position.code,
        isActive: position.isActive,
        isBlueCollar: position.isBlueCollar,
        vacationNorm: position.vacationNorm,
        isAccordWorkCondition: position.isAccordWorkCondition,
        accordWorkConditionDay: position.accordWorkConditionDay,
        translations: normalizeTranslations(position.translations),
      });
    } else {
      reset({
        companyId,
        orgChartLevelId: null,
        code: '',
        isActive: true,
        isBlueCollar: false,
        vacationNorm: 21,
        isAccordWorkCondition: false,
        accordWorkConditionDay: 0,
        translations: defaultPositionTranslations(),
      });
    }
  }, [open, position, companyId, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('editPosition') : t('createPosition')}</DialogTitle>
        </DialogHeader>

        {loadingPosition ? (
          <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('companyId', { valueAsNumber: true })} />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label={t('code')}
                placeholder={t('codePlaceholder')}
                error={errors.code?.message}
                disabled={loading}
                {...register('code')}
              />
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="orgChartLevelId">{t('orgChartLevel')}</Label>
                <Controller
                  name="orgChartLevelId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={loading || isLoadingOrgChartLevels}
                      value={field.value != null ? String(field.value) : '__none__'}
                      onValueChange={(val) =>
                        field.onChange(val === '__none__' ? null : Number(val))
                      }
                    >
                      <SelectTrigger id="orgChartLevelId">
                        <SelectValue placeholder={t('orgChartLevelPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">{t('orgChartLevelNone')}</SelectItem>
                        {orgChartLevels.map((level) => (
                          <SelectItem key={level.id} value={String(level.id)}>
                            {level.name || level.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <FormField
                label={t('vacationNorm')}
                type="number"
                placeholder="21"
                error={errors.vacationNorm?.message}
                disabled={loading}
                {...register('vacationNorm', { valueAsNumber: true })}
              />
              <FormField
                label={t('accordWorkConditionDay')}
                type="number"
                placeholder="0"
                error={errors.accordWorkConditionDay?.message}
                disabled={loading}
                {...register('accordWorkConditionDay', { valueAsNumber: true })}
              />
            </div>

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
                      <FormField
                        label={t('description')}
                        placeholder={t('descriptionPlaceholder')}
                        disabled={loading}
                        {...register(`translations.${index}.description`)}
                      />
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Controller
                  name="isBlueCollar"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isBlueCollar"
                      checked={field.value}
                      disabled={loading}
                      onCheckedChange={(value) => field.onChange(value === true)}
                    />
                  )}
                />
                <Label htmlFor="isBlueCollar" className="cursor-pointer">
                  {t('isBlueCollar')}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Controller
                  name="isAccordWorkCondition"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isAccordWorkCondition"
                      checked={field.value}
                      disabled={loading}
                      onCheckedChange={(value) => field.onChange(value === true)}
                    />
                  )}
                />
                <Label htmlFor="isAccordWorkCondition" className="cursor-pointer">
                  {t('isAccordWorkCondition')}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="positionIsActive"
                      checked={field.value}
                      disabled={loading}
                      onCheckedChange={(value) => field.onChange(value === true)}
                    />
                  )}
                />
                <Label htmlFor="positionIsActive" className="cursor-pointer">
                  {t('active')}
                </Label>
              </div>
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
