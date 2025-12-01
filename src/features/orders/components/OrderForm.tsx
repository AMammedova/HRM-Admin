'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/atoms/Button';
import { Input } from '@/shared/atoms/Input';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/atoms/Select';
import { Textarea } from '@/shared/atoms/Textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/atoms/Form';

const orderFormSchema = z.object({
  orderType: z.string().min(1),
  orderSubType: z.string().min(1),
  orderNumber: z.string().min(1),
  orderDate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  employee: z.string().optional(),
  replacementEmployee: z.string().optional(),
  description: z.string().optional(),
  workStartDate: z.string().optional(),
  autoProlongationDate: z.string().optional(),
  isForeignCitizen: z.boolean().optional(),
  foreignSplit: z.enum(['none', 'split']).optional(),
  excelImport: z.boolean().optional(),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export interface OrderFormProps {
  onSubmit?: (data: OrderFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function OrderForm({ onSubmit, onCancel, loading = false }: OrderFormProps) {
  const t = useTranslations('orders');
  const tCommon = useTranslations('common');

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      orderType: '',
      orderSubType: '',
      orderNumber: '',
      foreignSplit: 'split',
    },
  });

  const handleSubmit = (values: OrderFormValues) => {
    onSubmit?.(values);
    if (!onSubmit) {
      // eslint-disable-next-line no-console
      console.log('Order form submit', values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="rounded-2xl border bg-card px-6 py-6">
          {/* Top selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <FormField
              control={form.control}
              name="orderType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('orderType')}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('orderTypePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vacation">{t('vacation')}</SelectItem>
                        <SelectItem value="other">{t('otherOrder')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderSubType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('orderSubType')}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('orderSubTypePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annualVacation">{t('annualVacation')}</SelectItem>
                        <SelectItem value="unpaidVacation">{t('unpaidVacation')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="orderNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('orderNumber')}</FormLabel>
                  <FormControl>
                    <Input placeholder="11.12.2002" {...field} />
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
              name="endDate"
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
              name="employee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('employee')}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectEmployee')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emp1">GRM13333 - Babək Ağamuradlı</SelectItem>
                        <SelectItem value="emp2">GRM12222 - Digər əməkdaş</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="replacementEmployee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('replacementEmployee')}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectReplacementEmployee')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t('noReplacement')}</SelectItem>
                        <SelectItem value="emp2">GRM12222 - Digər əməkdaş</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('workStartDate')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autoProlongationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('autoProlongationDate')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Foreign citizenship + split toggles */}
            <div className="space-y-2">
              <span className="text-sm font-medium">{t('foreignCitizen')}</span>
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="foreignSplit"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 !space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value === 'none'}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? 'none' : field.value === 'none' ? 'split' : field.value)
                          }
                        />
                      </FormControl>
                      <FormLabel className="font-normal !space-y-0">{t('doNotSplit')}</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="foreignSplit"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 justify-center !space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value === 'split'}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? 'split' : field.value === 'split' ? 'none' : field.value)
                          }
                        />
                      </FormControl>
                      <FormLabel className="font-normal !space-y-0 !mt-none">{t('split')}</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Excel import checkbox */}
            <FormField
              control={form.control}
              name="excelImport"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 !space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal !space-y-0">{t('excelImport')}</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => (onCancel ? onCancel() : form.reset())}
            disabled={loading}
          >
            {t('reset')}
          </Button>
          <Button type="submit" disabled={loading}>
            {tCommon('save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}


