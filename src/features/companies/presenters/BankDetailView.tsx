'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Landmark, MapPin, CreditCard, Hash } from 'lucide-react';
import { Badge } from '@/shared/atoms/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/atoms/Card';
import { Bank } from '../types/bank.types';

export interface BankDetailViewProps {
  bank: Bank;
  locale: string;
}

export function BankDetailView({ bank, locale }: BankDetailViewProps) {
  const t = useTranslations('banks');

  const primaryTranslation =
    bank.translations.find((tr) => tr.languageCode === locale) ??
    bank.translations.find((tr) => tr.languageCode === 'az') ??
    bank.translations[0];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Landmark className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {primaryTranslation?.name ?? bank.code}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('code')}: <span className="font-medium text-foreground">{bank.code}</span>
                </p>
                {primaryTranslation?.description && (
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    {primaryTranslation.description}
                  </p>
                )}
              </div>
            </div>
            <Badge variant={bank.isActive ? 'success' : 'secondary'} className="shrink-0">
              {bank.isActive ? t('active') : t('inactive')}
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Hash className="h-4 w-4 text-muted-foreground" />
              {t('generalInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DetailField label={t('code')} value={bank.code} />
            <DetailField label={t('taxId')} value={bank.taxId} />
            <DetailField label={t('swiftCode')} value={bank.swiftCode} />
            <DetailField
              label={t('address')}
              value={bank.address}
              icon={<MapPin className="h-3.5 w-3.5" />}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              {t('accountInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField
              label={t('correspondentAccount')}
              value={bank.correspondentAccount}
              mono
            />
            <DetailField label={t('settlementAccount')} value={bank.settlementAccount} mono />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('translations')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {bank.translations.map((tr) => (
            <div key={tr.languageCode} className="rounded-lg border bg-muted/30 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t(`lang.${tr.languageCode}`)}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <DetailField label={t('name')} value={tr.name} />
                <DetailField label={t('description')} value={tr.description} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function DetailField({
  label,
  value,
  icon,
  mono = false,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className={mono ? 'font-mono text-sm font-medium' : 'font-medium'}>{value || '—'}</p>
    </div>
  );
}
