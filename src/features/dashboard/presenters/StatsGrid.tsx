'use client';

import * as React from 'react';
import { Users, Briefcase, Clock, CheckCircle } from 'lucide-react';
import { StatCard } from '@/shared/molecules/StatCard';
import { DashboardStats } from '../types/dashboard.types';
import { useTranslations } from 'next-intl';

export interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const t = useTranslations('dashboard');

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t('totalEmployees')}
        value={stats.totalEmployees}
        icon={Users}
        trend={{ value: stats.monthlyGrowth, isPositive: true }}
        description={t('monthlyGrowth')}
      />
      <StatCard
        title={t('activeProjects')}
        value={stats.activeProjects}
        icon={Briefcase}
      />
      <StatCard
        title={t('pendingRequests')}
        value={stats.pendingRequests}
        icon={Clock}
      />
      <StatCard
        title={t('completedTasks')}
        value={stats.completedTasks}
        icon={CheckCircle}
      />
    </div>
  );
}

