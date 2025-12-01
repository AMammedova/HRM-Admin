'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/atoms/Button';
import { Input } from '@/shared/atoms/Input';
import { Checkbox } from '@/shared/atoms/Checkbox';
    import { Textarea } from '@/shared/atoms/Textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/atoms/Accordion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/atoms/Form';

const contractFormSchema = z.object({
  // Main info
  employee: z.string().min(1, { message: 'Employee is required' }),
  contractEndDate: z.string().optional(),
  contractNumber: z.string().min(1, { message: 'Contract number is required' }),
  isIndefinite: z.boolean().optional(),
  hasProbation: z.boolean().optional(),
  probationMonths: z.string().optional(),
  contractDate: z.string().optional(),
  probationType: z.string().optional(),

  // Additional fields
  orderNumber: z.string().optional(),
  orderDate: z.string().optional(),
  startDate: z.string().optional(),
  structureUnit: z.string().optional(),
  position: z.string().optional(),
  earningType: z.string().optional(),
  paymentTerms: z.string().optional(),
  contractCode: z.string().optional(),
  additionalIndefinite: z.boolean().optional(),
  shift: z.boolean().optional(),
  productionCalendar: z.string().optional(),
  employmentType: z.string().optional(),
  salaryGross: z.string().optional(),
  contractEndDateExtra: z.string().optional(),
  staffUnit: z.string().optional(),
  branches: z.boolean().optional(),
  extraWorkplace: z.boolean().optional(),
  description: z.string().optional(),
  workHoursFrom: z.string().optional(),
  workHoursTo: z.string().optional(),
  breakFrom: z.string().optional(),
  breakTo: z.string().optional(),

  // Termination
  terminationNumber: z.string().optional(),
  terminationOrderDate: z.string().optional(),
  terminationContractNumber: z.string().optional(),
  terminationBasis: z.string().optional(),
  extraPayment: z.string().optional(),
  isWorkDay: z.boolean().optional(),
  terminationEmploymentType: z.string().optional(),
  terminationDescription: z.string().optional(),
});

export type ContractFormValues = z.infer<typeof contractFormSchema>;

export interface ContractFormProps {
  onSubmit?: (data: ContractFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function ContractForm({ onSubmit, onCancel, loading = false }: ContractFormProps) {
  const t = useTranslations('contracts');
  const tCommon = useTranslations('common');

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      employee: '',
      contractEndDate: '',
      contractNumber: '',
      isIndefinite: false,
      hasProbation: false,
    },
  });

  const handleSubmit = (values: ContractFormValues) => {
    onSubmit?.(values);
    if (!onSubmit) {
      // fallback: just log for now
      // eslint-disable-next-line no-console
      console.log('Contract form submit', values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Accordion type="multiple" defaultValue={['main', 'additional', 'termination']}>
          {/* Main information */}
          <AccordionItem value="main" className="rounded-xl border bg-card mb-4">
            <div className="px-6 pt-4">
              <AccordionTrigger className="text-lg font-semibold">
                {t('mainInfoSection')}
              </AccordionTrigger>
            </div>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="employee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('employee')}</FormLabel>
                      <FormControl>
                        <Input placeholder="GRM13333 - Babək Ağamuradlı" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contractEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('endDate')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contractNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contractNumber')}</FormLabel>
                      <FormControl>
                        <Input placeholder="GRM090918" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isIndefinite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('indefiniteContract')}</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 h-10">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked === true)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasProbation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('probationPeriod')}</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 h-10">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked === true)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="probationMonths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('probationMonths')}</FormLabel>
                      <FormControl>
                        <Input placeholder="3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contractDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contractDate')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="probationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('probationType')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('probationTypePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File upload placeholder */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">{t('uploadFile')}</span>
                  <Button type="button" variant="outline" className="w-full md:w-auto">
                    {t('chooseFile')}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Additional fields */}
          <AccordionItem value="additional" className="rounded-xl border bg-card mb-4">
            <div className="px-6 pt-4">
              <AccordionTrigger className="text-lg font-semibold">
                {t('additionalFieldsSection')}
              </AccordionTrigger>
            </div>
            <AccordionContent className="px-6 pb-6 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sample of key additional fields; others can be extended similarly */}
                <FormField
                  control={form.control}
                  name="orderNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('orderNumber')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orderDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('orderDate')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('startDate')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="structureUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('structureUnit')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('position')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salaryGross"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('salaryGross')}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel>{t('description')}</FormLabel>
                      <FormControl>
                        <Textarea asChild={false} placeholder="" {...(field as any)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Termination section */}
          <AccordionItem value="termination" className="rounded-xl border bg-card">
            <div className="px-6 pt-4">
              <AccordionTrigger className="text-lg font-semibold">
                {t('terminationSection')}
              </AccordionTrigger>
            </div>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="terminationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('terminationNumber')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="terminationOrderDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('terminationOrderDate')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="terminationContractNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('terminationContractNumber')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="terminationBasis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('terminationBasis')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="extraPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('extraPayment')}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isWorkDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('isWorkDay')}</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 h-10">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked === true)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="terminationEmploymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('terminationEmploymentType')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="terminationDescription"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel>{t('terminationDescription')}</FormLabel>
                      <FormControl>
                        <Textarea asChild={false} placeholder="" {...(field as any)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => (onCancel ? onCancel() : form.reset())}
            disabled={loading}
          >
            {tCommon('cancel')}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? tCommon('saving') ?? tCommon('save') : tCommon('save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}


