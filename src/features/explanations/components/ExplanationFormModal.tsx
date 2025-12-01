'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/atoms/Dialog';
import { Button } from '@/shared/atoms/Button';
import { Input } from '@/shared/atoms/Input';
import { Checkbox } from '@/shared/atoms/Checkbox';
import { Textarea } from '@/shared/atoms/Textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/atoms/Form';

const explanationFormSchema = z.object({
  positionCode: z.string().min(1),
  positionName: z.string().min(1),
  level: z.string().optional(),
  baseVacationDays: z.string().optional(),
  workCode: z.string().optional(),
  isMain: z.boolean().optional(),
  byActivity: z.boolean().optional(),
  functions: z.string().optional(),
  activityDays: z.string().optional(),
});

export type ExplanationFormValues = z.infer<typeof explanationFormSchema>;

export interface ExplanationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: ExplanationFormValues) => void;
  loading?: boolean;
}

export function ExplanationFormModal({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: ExplanationFormModalProps) {
  const t = useTranslations('explanations');
  const tCommon = useTranslations('common');

  const form = useForm<ExplanationFormValues>({
    resolver: zodResolver(explanationFormSchema),
    defaultValues: {
      positionCode: '',
      positionName: '',
      level: '',
      baseVacationDays: '',
      workCode: '',
      isMain: false,
      byActivity: false,
      functions: '',
      activityDays: '',
    },
  });

  const handleSubmit = (values: ExplanationFormValues) => {
    onSubmit?.(values);
    if (!onSubmit) {
      // eslint-disable-next-line no-console
      console.log('Explanation submit', values);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('modalTitle')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="positionCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('positionCode')}</FormLabel>
                    <FormControl>
                      <Input placeholder="11.12.2002" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="positionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('positionName')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Vəzifə adı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('level')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Səviyyə" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="baseVacationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('baseVacationDays')}</FormLabel>
                    <FormControl>
                      <Input placeholder="11.12.2002" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('workCode')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('workCode')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isMain"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{t('isMain')}</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="byActivity"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{t('byActivity')}</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="functions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('functions')}</FormLabel>
                    <FormControl>
                      <Textarea rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activityDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('activityDays')}</FormLabel>
                    <FormControl>
                      <Textarea rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => (onOpenChange(false), form.reset())}
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
      </DialogContent>
    </Dialog>
  );
}


