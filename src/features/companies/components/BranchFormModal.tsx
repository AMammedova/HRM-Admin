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
  branchSchema,
  BranchFormData,
  defaultBranchTranslations,
} from '@/validators/branch.schema';
import { Branch, BranchTranslation } from '../types/branch.types';

function normalizeTranslations(translations: BranchTranslation[]): BranchFormData['translations'] {
  const defaults = defaultBranchTranslations();
  return defaults.map((def) => {
    const found = translations.find((tr) => tr.languageCode === def.languageCode);
    return found ? { languageCode: def.languageCode, name: found.name } : def;
  });
}

export interface BranchFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  branch?: Branch | null;
  loadingBranch?: boolean;
  onSubmit: (data: BranchFormData) => void;
  loading?: boolean;
}

const LANGUAGE_TABS = ['az', 'en', 'ru'] as const;

export function BranchFormModal({
  open,
  onOpenChange,
  companyId,
  branch,
  loadingBranch = false,
  onSubmit,
  loading = false,
}: BranchFormModalProps) {
  const t = useTranslations('branches');
  const tCommon = useTranslations('common');
  const isEdit = !!branch;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      companyId,
      code: '',
      isActive: true,
      isOffice: false,
      phone: '',
      email: '',
      address: '',
      region: '',
      translations: defaultBranchTranslations(),
    },
  });

  const translations = watch('translations');

  const getTranslationIndex = (lang: (typeof LANGUAGE_TABS)[number]) =>
    translations.findIndex((tr) => tr.languageCode === lang);

  React.useEffect(() => {
    if (!open) return;

    if (branch) {
      reset({
        companyId: branch.companyId,
        code: branch.code,
        isActive: branch.isActive,
        isOffice: branch.isOffice,
        phone: branch.phone,
        email: branch.email,
        address: branch.address ?? '',
        region: branch.region,
        translations: normalizeTranslations(branch.translations),
      });
    } else {
      reset({
        companyId,
        code: '',
        isActive: true,
        isOffice: false,
        phone: '',
        email: '',
        address: '',
        region: '',
        translations: defaultBranchTranslations(),
      });
    }
  }, [open, branch, companyId, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('editBranch') : t('createBranch')}</DialogTitle>
        </DialogHeader>

        {loadingBranch ? (
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
              <FormField
                label={t('region')}
                placeholder={t('regionPlaceholder')}
                error={errors.region?.message}
                disabled={loading}
                {...register('region')}
              />
              <FormField
                label={t('phone')}
                type="tel"
                placeholder="+994501234567"
                error={errors.phone?.message}
                disabled={loading}
                {...register('phone')}
              />
              <FormField
                label={t('email')}
                type="email"
                placeholder="branch@company.az"
                error={errors.email?.message}
                disabled={loading}
                {...register('email')}
              />
            </div>

            <FormField
              label={t('address')}
              placeholder={t('addressPlaceholder')}
              error={errors.address?.message}
              disabled={loading}
              {...register('address')}
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

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Controller
                  name="isOffice"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isOffice"
                      checked={field.value}
                      disabled={loading}
                      onCheckedChange={(value) => field.onChange(value === true)}
                    />
                  )}
                />
                <Label htmlFor="isOffice" className="cursor-pointer">
                  {t('isOffice')}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="branchIsActive"
                      checked={field.value}
                      disabled={loading}
                      onCheckedChange={(value) => field.onChange(value === true)}
                    />
                  )}
                />
                <Label htmlFor="branchIsActive" className="cursor-pointer">
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
