'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Building2 } from 'lucide-react';
import { Button } from '@/shared/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/atoms/Card';
import { cn } from '@/shared/lib/utils';
import type { Company } from '../types/auth.types';

export interface SelectCompanyFormProps {
  companies: Company[];
  onSubmit: (companyId: number) => void;
  loading?: boolean;
  error?: string;
}

export function SelectCompanyForm({
  companies,
  onSubmit,
  loading = false,
  error,
}: SelectCompanyFormProps) {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const [selectedId, setSelectedId] = React.useState<number | null>(
    companies.length === 1 ? companies[0].companyId : null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId !== null) {
      onSubmit(selectedId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('selectCompany')}</CardTitle>
        <CardDescription>{t('selectCompanyDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ul className="space-y-2">
            {companies.map((company) => {
              const isSelected = selectedId === company.companyId;
              return (
                <li key={company.companyId}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(company.companyId)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:bg-muted/50'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}
                    >
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{company.companyName}</p>
                      <p className="text-sm text-muted-foreground">{company.roleName}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || selectedId === null}
          >
            {loading ? tCommon('loading') : t('continue')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
