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
  orgChartLevelSchema,
  OrgChartLevelFormData,
  defaultOrgChartLevelTranslations,
} from '@/validators/org-chart-level.schema';
import { OrgChartLevel, OrgChartLevelTranslation } from '../types/org-chart-level.types';
import { orgChartLinesApi } from '../api/org-chart-lines.api';
import { orgChartLevelsApi } from '../api/org-chart-levels.api';

function normalizeTranslations(
  translations: OrgChartLevelTranslation[]
): OrgChartLevelFormData['translations'] {
  const defaults = defaultOrgChartLevelTranslations();
  return defaults.map((def) => {
    const found = translations.find((tr) => tr.languageCode === def.languageCode);
    return found ? { languageCode: def.languageCode, name: found.name } : def;
  });
}

export interface OrgChartLevelFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  orgChartLevel?: OrgChartLevel | null;
  loadingOrgChartLevel?: boolean;
  onSubmit: (data: OrgChartLevelFormData) => void;
  loading?: boolean;
}

const LANGUAGE_TABS = ['az', 'en', 'ru'] as const;

export function OrgChartLevelFormModal({
  open,
  onOpenChange,
  companyId,
  orgChartLevel,
  loadingOrgChartLevel = false,
  onSubmit,
  loading = false,
}: OrgChartLevelFormModalProps) {
  const t = useTranslations('orgChartLevels');
  const tCommon = useTranslations('common');
  const isEdit = !!orgChartLevel;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<OrgChartLevelFormData>({
    resolver: zodResolver(orgChartLevelSchema),
    defaultValues: {
      companyId,
      orgChartLineId: undefined,
      parentId: null,
      code: '',
      isVisible: true,
      translations: defaultOrgChartLevelTranslations(),
    },
  });

  const translations = watch('translations');
  const selectedOrgChartLineId = watch('orgChartLineId');

  const getTranslationIndex = (lang: (typeof LANGUAGE_TABS)[number]) =>
    translations.findIndex((tr) => tr.languageCode === lang);

  const { data: orgChartLines = [], isLoading: isLoadingLines } = useQuery({
    queryKey: ['company-org-chart-lines-all', companyId],
    queryFn: () => orgChartLinesApi.getAll(companyId),
    enabled: !!companyId && open,
  });

  const { data: parentOptions = [], isLoading: isLoadingParents } = useQuery({
    queryKey: ['company-org-chart-levels-all', companyId, selectedOrgChartLineId],
    queryFn: () => orgChartLevelsApi.getAll(companyId, selectedOrgChartLineId),
    enabled: !!companyId && !!selectedOrgChartLineId && open,
  });

  const filteredParentOptions = isEdit
    ? parentOptions.filter((p) => p.id !== orgChartLevel?.id)
    : parentOptions;

  React.useEffect(() => {
    if (!open) return;

    if (orgChartLevel) {
      reset({
        companyId: orgChartLevel.companyId,
        orgChartLineId: orgChartLevel.orgChartLineId,
        parentId: orgChartLevel.parentId ?? null,
        code: orgChartLevel.rowId,
        isVisible: orgChartLevel.isVisible,
        translations: normalizeTranslations(orgChartLevel.translations),
      });
    } else {
      reset({
        companyId,
        orgChartLineId: undefined,
        parentId: null,
        code: '',
        isVisible: true,
        translations: defaultOrgChartLevelTranslations(),
      });
    }
  }, [open, orgChartLevel, companyId, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('editOrgChartLevel') : t('createOrgChartLevel')}
          </DialogTitle>
        </DialogHeader>

        {loadingOrgChartLevel ? (
          <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('companyId', { valueAsNumber: true })} />

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Org Chart Line */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="orgChartLineId">
                  {t('orgChartLine')}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Controller
                  name="orgChartLineId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={loading || isLoadingLines}
                      value={field.value != null ? String(field.value) : ''}
                      onValueChange={(val) => {
                        field.onChange(Number(val));
                        // reset parent when line changes
                      }}
                    >
                      <SelectTrigger
                        id="orgChartLineId"
                        className={errors.orgChartLineId ? 'border-destructive' : ''}
                      >
                        <SelectValue placeholder={t('orgChartLinePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {orgChartLines.map((line) => (
                          <SelectItem key={line.id} value={String(line.id)}>
                            {line.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.orgChartLineId && (
                  <p className="text-xs text-destructive">{errors.orgChartLineId.message}</p>
                )}
              </div>

              {/* Parent Level */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="parentId">{t('parentLevel')}</Label>
                <Controller
                  name="parentId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={loading || isLoadingParents || !selectedOrgChartLineId}
                      value={field.value != null ? String(field.value) : '__none__'}
                      onValueChange={(val) =>
                        field.onChange(val === '__none__' ? null : Number(val))
                      }
                    >
                      <SelectTrigger id="parentId">
                        <SelectValue placeholder={t('parentLevelPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">{t('parentLevelNone')}</SelectItem>
                        {filteredParentOptions.map((lvl) => (
                          <SelectItem key={lvl.id} value={String(lvl.id)}>
                            {lvl.name || lvl.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Code */}
              <FormField
                label={t('code')}
                placeholder={t('codePlaceholder')}
                error={errors.code?.message}
                disabled={loading}
                {...register('code')}
              />
            </div>

            {/* Translations */}
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

            {/* isVisible */}
            <div className="flex items-center gap-3">
              <Controller
                name="isVisible"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="levelIsVisible"
                    checked={field.value}
                    disabled={loading}
                    onCheckedChange={(value) => field.onChange(value === true)}
                  />
                )}
              />
              <Label htmlFor="levelIsVisible" className="cursor-pointer">
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
