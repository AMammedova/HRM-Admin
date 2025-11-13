'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboard.api';
import { StatsGrid } from '../presenters/StatsGrid';
import { ChartsSection } from '../presenters/ChartsSection';
import { RecentActivityTable } from '../presenters/RecentActivityTable';
import { useTranslations } from 'next-intl';

export interface DashboardContainerProps {
  locale: string;
}

export function DashboardContainer({ locale }: DashboardContainerProps) {
  const tCommon = useTranslations('common');

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboardData,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">{tCommon('loading')}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-destructive">{tCommon('error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatsGrid stats={data.stats} />
      <ChartsSection monthlyData={data.monthlyData} departmentData={data.departmentData} />
      <RecentActivityTable activities={data.recentActivities} locale={locale} />
    </div>
  );
}

