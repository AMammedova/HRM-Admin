'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Clock, Hash, ListOrdered, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/atoms/Dialog';
import { Badge } from '@/shared/atoms/Badge';
import { Button } from '@/shared/atoms/Button';
import { OvertimeSetting } from '../types/overtime-setting.types';

export interface OvertimeSettingViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setting?: OvertimeSetting | null;
  loading?: boolean;
  locale: string;
  onEdit?: () => void;
}

function DetailField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value ?? '—'}</p>
    </div>
  );
}

export function OvertimeSettingViewModal({
  open,
  onOpenChange,
  setting,
  loading = false,
  locale,
  onEdit,
}: OvertimeSettingViewModalProps) {
  const t = useTranslations('overtimeSettings');
  const tCommon = useTranslations('common');

  const primaryTranslation =
    setting?.translations.find((tr) => tr.languageCode === locale) ??
    setting?.translations.find((tr) => tr.languageCode === 'az') ??
    setting?.translations[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('viewDetails')}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
        ) : !setting ? (
          <p className="text-sm text-destructive">{t('loadError')}</p>
        ) : (
          <div className="space-y-5">
            <div className="rounded-xl border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="text-lg font-semibold leading-tight">
                    {primaryTranslation?.name ?? setting.code}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={setting.isActive ? 'success' : 'secondary'}>
                      {setting.isActive ? t('active') : t('inactive')}
                    </Badge>
                    <Badge variant="outline">
                      {t('sortOrder')}: {setting.sortOrder}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Hash className="h-4 w-4 text-muted-foreground" />
                {t('generalInfo')}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailField label={t('code')} value={setting.code} />
                <DetailField label={t('sortOrder')} value={setting.sortOrder} />
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <ListOrdered className="h-4 w-4 text-muted-foreground" />
                {t('translations')}
              </div>
              <div className="space-y-3">
                {setting.translations.map((tr) => (
                  <div
                    key={tr.languageCode}
                    className="rounded-lg border bg-muted/30 px-3 py-2.5"
                  >
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t(`lang.${tr.languageCode}`)}
                    </p>
                    <p className="font-medium">{tr.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {tCommon('close')}
              </Button>
              {onEdit && (
                <Button type="button" onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t('editSetting')}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
