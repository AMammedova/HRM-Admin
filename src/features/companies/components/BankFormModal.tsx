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
  bankSchema,
  BankFormData,
  defaultBankTranslations,
} from '@/validators/bank.schema';
import { Bank, BankTranslation } from '../types/bank.types';

function normalizeTranslations(translations: BankTranslation[]): BankFormData['translations'] {
  const defaults = defaultBankTranslations();
  return defaults.map((def) => {
    const found = translations.find((tr) => tr.languageCode === def.languageCode);
    return found
      ? {
          languageCode: def.languageCode,
          name: found.name,
          description: found.description ?? '',
        }
      : def;
  });
}

export interface BankFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  bank?: Bank | null;
  loadingBank?: boolean;
  onSubmit: (data: BankFormData) => void;
  loading?: boolean;
}

const LANGUAGE_TABS = ['az', 'en', 'ru'] as const;

export function BankFormModal({
  open,
  onOpenChange,
  companyId,
  bank,
  loadingBank = false,
  onSubmit,
  loading = false,
}: BankFormModalProps) {
  const t = useTranslations('banks');
  const tCommon = useTranslations('common');
  const isEdit = !!bank;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      companyId,
      code: '',
      taxId: '',
      address: '',
      swiftCode: '',
      correspondentAccount: '',
      settlementAccount: '',
      isActive: true,
      translations: defaultBankTranslations(),
    },
  });

  const translations = watch('translations');

  const getTranslationIndex = (lang: (typeof LANGUAGE_TABS)[number]) =>
    translations.findIndex((tr) => tr.languageCode === lang);

  React.useEffect(() => {
    if (!open) return;

    if (bank) {
      reset({
        companyId: bank.companyId,
        code: bank.code,
        taxId: bank.taxId,
        address: bank.address,
        swiftCode: bank.swiftCode,
        correspondentAccount: bank.correspondentAccount,
        settlementAccount: bank.settlementAccount,
        isActive: bank.isActive,
        translations: normalizeTranslations(bank.translations),
      });
    } else {
      reset({
        companyId,
        code: '',
        taxId: '',
        address: '',
        swiftCode: '',
        correspondentAccount: '',
        settlementAccount: '',
        isActive: true,
        translations: defaultBankTranslations(),
      });
    }
  }, [open, bank, companyId, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('editBank') : t('createBank')}</DialogTitle>
        </DialogHeader>

        {loadingBank ? (
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
                label={t('taxId')}
                placeholder={t('taxIdPlaceholder')}
                error={errors.taxId?.message}
                disabled={loading}
                {...register('taxId')}
              />
              <FormField
                label={t('swiftCode')}
                placeholder={t('swiftCodePlaceholder')}
                error={errors.swiftCode?.message}
                disabled={loading}
                {...register('swiftCode')}
              />
              <FormField
                label={t('correspondentAccount')}
                placeholder={t('correspondentAccountPlaceholder')}
                error={errors.correspondentAccount?.message}
                disabled={loading}
                {...register('correspondentAccount')}
              />
              <FormField
                label={t('settlementAccount')}
                placeholder={t('settlementAccountPlaceholder')}
                error={errors.settlementAccount?.message}
                disabled={loading}
                {...register('settlementAccount')}
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
                      <FormField
                        label={t('description')}
                        placeholder={t('descriptionPlaceholder')}
                        error={translationErrors?.description?.message}
                        disabled={loading}
                        {...register(`translations.${index}.description`)}
                      />
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>

            <div className="flex items-center gap-3">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="bankIsActive"
                    checked={field.value}
                    disabled={loading}
                    onCheckedChange={(value) => field.onChange(value === true)}
                  />
                )}
              />
              <Label htmlFor="bankIsActive" className="cursor-pointer">
                {t('active')}
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
