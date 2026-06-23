'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { companiesApi } from '../api/companies.api';
import { CompanyDetailView } from '../presenters/CompanyDetailView';
import { Button } from '@/shared/atoms/Button';

export interface CompanyDetailContainerProps {
  companyId: number;
  locale: string;
}

export function CompanyDetailContainer({ companyId, locale }: CompanyDetailContainerProps) {
  const router = useRouter();
  const t = useTranslations('companies');
  const tCommon = useTranslations('common');

  const { data: company, isLoading, isError } = useQuery({
    queryKey: ['company-detail', companyId],
    queryFn: () => companiesApi.getDetail(companyId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">{tCommon('loading')}</p>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {t('loadError')}
        </div>
        <Button variant="outline" onClick={() => router.push(`/${locale}/companies`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToList')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href={`/${locale}/companies/${companyId}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            {t('editCompany')}
          </Button>
        </Link>
      </div>
      <CompanyDetailView company={company} locale={locale} />
    </div>
  );
}
