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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/atoms/Select';
import {
  employeeSchema,
  EmployeeFormData,
  defaultEmployeeTranslations,
  toDateInputValue,
  toApiDateTime,
} from '@/validators/employee.schema';
import {
  Employee,
  EmployeeTranslation,
} from '../types/employee.types';

function normalizeTranslations(translations: EmployeeTranslation[]): EmployeeFormData['translations'] {
  const defaults = defaultEmployeeTranslations();
  return defaults.map((def) => {
    const found = translations.find((tr) => tr.languageCode === def.languageCode);
    return found
      ? {
          languageCode: def.languageCode,
          surname: found.surname,
          name: found.name,
          fatherName: found.fatherName ?? '',
        }
      : def;
  });
}

export interface EmployeeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  employee?: Employee | null;
  loadingEmployee?: boolean;
  onSubmit: (data: EmployeeFormData) => void;
  loading?: boolean;
}

const LANGUAGE_TABS = ['az', 'en', 'ru'] as const;

export function EmployeeFormModal({
  open,
  onOpenChange,
  companyId,
  employee,
  loadingEmployee = false,
  onSubmit,
  loading = false,
}: EmployeeFormModalProps) {
  const t = useTranslations('employees');
  const tCommon = useTranslations('common');
  const isEdit = !!employee;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      companyId,
      code: '',
      birthDate: '',
      birthPlace: '',
      citizenship: '',
      gender: true,
      socialCardNum: '',
      bloodGroupLookupValueId: 0,
      isMarried: false,
      hasDriverLicense: false,
      hasMilitaryService: false,
      militaryCardNum: '',
      academicDegree: '',
      isForeignNational: false,
      isTaxCalculated: false,
      maxDeductionPercent: 0,
      autoCalcOvertime: false,
      vacationPercent: 0,
      translations: defaultEmployeeTranslations(),
    },
  });

  const translations = watch('translations');

  const getTranslationIndex = (lang: (typeof LANGUAGE_TABS)[number]) =>
    translations.findIndex((tr) => tr.languageCode === lang);

  React.useEffect(() => {
    if (!open) return;

    if (employee) {
      reset({
        companyId: employee.companyId,
        code: employee.code,
        birthDate: toDateInputValue(employee.birthDate),
        birthPlace: employee.birthPlace,
        citizenship: employee.citizenship,
        gender: employee.gender,
        socialCardNum: employee.socialCardNum,
        bloodGroupLookupValueId: employee.bloodGroupLookupValueId,
        isMarried: employee.isMarried,
        hasDriverLicense: employee.hasDriverLicense,
        hasMilitaryService: employee.hasMilitaryService,
        militaryCardNum: employee.militaryCardNum ?? '',
        academicDegree: employee.academicDegree ?? '',
        isForeignNational: employee.isForeignNational,
        isTaxCalculated: employee.isTaxCalculated,
        maxDeductionPercent: employee.maxDeductionPercent,
        autoCalcOvertime: employee.autoCalcOvertime,
        vacationPercent: employee.vacationPercent,
        translations: normalizeTranslations(employee.translations),
      });
    } else {
      reset({
        companyId,
        code: '',
        birthDate: '',
        birthPlace: '',
        citizenship: '',
        gender: true,
        socialCardNum: '',
        bloodGroupLookupValueId: 0,
        isMarried: false,
        hasDriverLicense: false,
        hasMilitaryService: false,
        militaryCardNum: '',
        academicDegree: '',
        isForeignNational: false,
        isTaxCalculated: false,
        maxDeductionPercent: 0,
        autoCalcOvertime: false,
        vacationPercent: 0,
        translations: defaultEmployeeTranslations(),
      });
    }
  }, [open, employee, companyId, reset]);

  const handleFormSubmit = (data: EmployeeFormData) => {
    onSubmit({
      ...data,
      birthDate: toApiDateTime(data.birthDate),
      militaryCardNum: data.militaryCardNum ?? '',
      academicDegree: data.academicDegree ?? '',
      translations: data.translations.map((tr) => ({
        ...tr,
        fatherName: tr.fatherName ?? '',
      })),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('editEmployee') : t('addEmployee')}</DialogTitle>
        </DialogHeader>

        {loadingEmployee ? (
          <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <input type="hidden" {...register('companyId', { valueAsNumber: true })} />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label={t('employeeCode')}
                placeholder={t('codePlaceholder')}
                error={errors.code?.message}
                disabled={loading}
                {...register('code')}
              />
              <FormField
                label={t('birthDate')}
                type="date"
                error={errors.birthDate?.message}
                disabled={loading}
                {...register('birthDate')}
              />
              <FormField
                label={t('birthPlace')}
                placeholder={t('birthPlacePlaceholder')}
                error={errors.birthPlace?.message}
                disabled={loading}
                {...register('birthPlace')}
              />
              <FormField
                label={t('citizenship')}
                placeholder={t('citizenshipPlaceholder')}
                error={errors.citizenship?.message}
                disabled={loading}
                {...register('citizenship')}
              />
              <FormField
                label={t('fin')}
                placeholder={t('finPlaceholder')}
                error={errors.socialCardNum?.message}
                disabled={loading}
                {...register('socialCardNum')}
              />
              <FormField
                label={t('bloodGroupLookupValueId')}
                type="number"
                error={errors.bloodGroupLookupValueId?.message}
                disabled={loading}
                {...register('bloodGroupLookupValueId', { valueAsNumber: true })}
              />
              <div className="space-y-2">
                <Label>{t('gender')}</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ? 'true' : 'false'}
                      onValueChange={(value) => field.onChange(value === 'true')}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">{t('male')}</SelectItem>
                        <SelectItem value="false">{t('female')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <FormField
                label={t('militaryCardNum')}
                placeholder={t('militaryCardNumPlaceholder')}
                error={errors.militaryCardNum?.message}
                disabled={loading}
                {...register('militaryCardNum')}
              />
              <FormField
                label={t('academicDegree')}
                placeholder={t('academicDegreePlaceholder')}
                error={errors.academicDegree?.message}
                disabled={loading}
                {...register('academicDegree')}
              />
              <FormField
                label={t('maxDeductionPercent')}
                type="number"
                error={errors.maxDeductionPercent?.message}
                disabled={loading}
                {...register('maxDeductionPercent', { valueAsNumber: true })}
              />
              <FormField
                label={t('vacationPercent')}
                type="number"
                error={errors.vacationPercent?.message}
                disabled={loading}
                {...register('vacationPercent', { valueAsNumber: true })}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { name: 'isMarried' as const, label: t('isMarried') },
                { name: 'hasDriverLicense' as const, label: t('hasDriverLicense') },
                { name: 'hasMilitaryService' as const, label: t('hasMilitaryService') },
                { name: 'isForeignNational' as const, label: t('isForeignNational') },
                { name: 'isTaxCalculated' as const, label: t('isTaxCalculated') },
                { name: 'autoCalcOvertime' as const, label: t('autoCalcOvertime') },
              ].map(({ name, label }) => (
                <div key={name} className="flex items-center gap-3">
                  <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={name}
                        checked={field.value}
                        disabled={loading}
                        onCheckedChange={(value) => field.onChange(value === true)}
                      />
                    )}
                  />
                  <Label htmlFor={name} className="cursor-pointer">{label}</Label>
                </div>
              ))}
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
                      <input type="hidden" {...register(`translations.${index}.languageCode`)} />

                      <FormField
                        label={t('surname')}
                        placeholder={t('surnamePlaceholder')}
                        error={translationErrors?.surname?.message}
                        disabled={loading}
                        {...register(`translations.${index}.surname`)}
                      />
                      <FormField
                        label={t('firstName')}
                        placeholder={t('firstNamePlaceholder')}
                        error={translationErrors?.name?.message}
                        disabled={loading}
                        {...register(`translations.${index}.name`)}
                      />
                      <FormField
                        label={t('fatherName')}
                        placeholder={t('fatherNamePlaceholder')}
                        error={translationErrors?.fatherName?.message}
                        disabled={loading}
                        {...register(`translations.${index}.fatherName`)}
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
