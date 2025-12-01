'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/atoms/Button';
import { Input } from '@/shared/atoms/Input';
import { Textarea } from '@/shared/atoms/Textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/atoms/Form';

const announcementFormSchema = z.object({
  title: z.string().min(1),
  date: z.string().optional(),
  endDate: z.string().optional(),
  content: z.string().optional(),
});

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export interface AnnouncementFormProps {
  onSubmit?: (data: AnnouncementFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function AnnouncementForm({
  onSubmit,
  onCancel,
  loading = false,
}: AnnouncementFormProps) {
  const t = useTranslations('announcements');
  const tCommon = useTranslations('common');

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: '',
      date: '',
      endDate: '',
      content: '',
    },
  });

  const handleSubmit = (values: AnnouncementFormValues) => {
    onSubmit?.(values);
    if (!onSubmit) {
      // eslint-disable-next-line no-console
      console.log('Announcement form submit', values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="rounded-2xl border bg-card px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('titleField')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Elan adı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('date')}</FormLabel>
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
          </div>

          <div className="mt-8 grid grid-cols-1">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('content')}</FormLabel>
                  <FormControl>
                    <Textarea rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
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


