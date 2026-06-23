'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/shared/atoms/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/atoms/Card';
import { CompanyDetail } from '../types/company.types';

export interface CompanyDetailViewProps {
  company: CompanyDetail;
  locale: string;
}

export function CompanyDetailView({ company, locale }: CompanyDetailViewProps) {
  const t = useTranslations('companies');

  const translation =
    company.translations.find((tr) => tr.languageCode === locale) ??
    company.translations.find((tr) => tr.languageCode === 'az') ??
    company.translations[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{translation?.name ?? company.compCode}</CardTitle>
            <Badge variant={company.isActive ? 'success' : 'secondary'}>
              {company.isActive ? t('active') : t('inactive')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <DetailField label={t('compCode')} value={company.compCode} />
          <DetailField label={t('taxId')} value={company.taxId} />
          <DetailField label={t('email')} value={company.email} />
          <DetailField label={t('companyType')} value={company.companyType?.code} />
          <DetailField
            label={t('timesheetPeriodType')}
            value={company.timesheetPeriodType?.code}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('translations')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {company.translations.map((tr) => (
            <div key={tr.languageCode} className="rounded-lg border p-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                {t(`lang.${tr.languageCode}`)}
              </p>
              <div className="grid gap-2 md:grid-cols-3">
                <DetailField label={t('name')} value={tr.name} />
                <DetailField label={t('factAddress')} value={tr.factAddress} />
                <DetailField label={t('legalAddress')} value={tr.legalAddress} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {company.workCalendars.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('workCalendars')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {company.workCalendars.map((calendar) => {
              const calName =
                calendar.translations.find((tr) => tr.languageCode === locale)?.name ??
                calendar.translations[0]?.name ??
                calendar.code;

              return (
                <div key={calendar.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium">{calName}</p>
                    <Badge variant={calendar.isActive ? 'success' : 'secondary'}>
                      {calendar.code}
                    </Badge>
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {t('defaultHours')}: {calendar.defaultHours}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {calendar.daySettings.map((day) => (
                      <div
                        key={day.id}
                        className="rounded border px-2 py-1 text-center text-xs"
                      >
                        <p className="text-muted-foreground">{day.dayNo}</p>
                        <p className="font-medium">{day.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DetailField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || '—'}</p>
    </div>
  );
}
