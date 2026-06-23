'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  MapPin,
  Phone,
  Mail,
  Hash,
  Building2,
  Clock,
} from 'lucide-react';
import { Badge } from '@/shared/atoms/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/atoms/Card';
import { BranchDetail } from '../types/branch.types';

export interface BranchDetailViewProps {
  branch: BranchDetail;
  locale: string;
}

export function BranchDetailView({ branch, locale }: BranchDetailViewProps) {
  const t = useTranslations('branches');

  const primaryTranslation =
    branch.translations.find((tr) => tr.languageCode === locale) ??
    branch.translations.find((tr) => tr.languageCode === 'az') ??
    branch.translations[0];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <MapPin className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {primaryTranslation?.name ?? branch.code}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('code')}: <span className="font-medium text-foreground">{branch.code}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('region')}: <span className="font-medium text-foreground">{branch.region}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={branch.isOffice ? 'default' : 'outline'}>
                {branch.isOffice ? t('office') : t('branch')}
              </Badge>
              <Badge variant={branch.isActive ? 'success' : 'secondary'}>
                {branch.isActive ? t('active') : t('inactive')}
              </Badge>
            </div>
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
            <DetailField label={t('code')} value={branch.code} />
            <DetailField label={t('region')} value={branch.region} />
            <DetailField
              label={t('address')}
              value={branch.address}
              icon={<MapPin className="h-3.5 w-3.5" />}
            />
            {branch.legacyId != null && (
              <DetailField label={t('legacyId')} value={String(branch.legacyId)} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              {t('contactInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField
              label={t('phone')}
              value={branch.phone}
              icon={<Phone className="h-3.5 w-3.5" />}
            />
            <DetailField
              label={t('email')}
              value={branch.email}
              icon={<Mail className="h-3.5 w-3.5" />}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('translations')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {branch.translations.map((tr) => (
            <div key={tr.languageCode} className="rounded-lg border bg-muted/30 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t(`lang.${tr.languageCode}`)}
              </p>
              <DetailField label={t('name')} value={tr.name} />
            </div>
          ))}
        </CardContent>
      </Card>

      {branch.workHours && branch.workHours.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {t('workHours')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {branch.workHours.map((hour) => (
                <div
                  key={hour.id ?? hour.dayNo}
                  className="rounded-lg border p-3 text-sm"
                >
                  <p className="font-medium">
                    {hour.dayName ?? t('day', { day: hour.dayNo })}
                  </p>
                  <p className="text-muted-foreground">
                    {hour.startTime && hour.endTime
                      ? `${hour.startTime} – ${hour.endTime}`
                      : hour.isWorkingDay === false
                        ? t('nonWorkingDay')
                        : '—'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DetailField({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="font-medium">{value || '—'}</p>
    </div>
  );
}
