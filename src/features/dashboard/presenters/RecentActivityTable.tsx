'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/atoms/Card';
import { Badge } from '@/shared/atoms/Badge';
import { RecentActivity } from '../types/dashboard.types';
import { formatDateTime } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';
import { useIsMounted } from '@/shared/hooks/useIsMounted';

export interface RecentActivityTableProps {
  activities: RecentActivity[];
  locale: string;
}

const typeVariants: Record<RecentActivity['type'], 'default' | 'success' | 'warning' | 'destructive'> = {
  info: 'default',
  success: 'success',
  warning: 'warning',
  error: 'destructive',
};

export function RecentActivityTable({ activities, locale }: RecentActivityTableProps) {
  const t = useTranslations('dashboard');
  const isMounted = useIsMounted();

  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start justify-between border-b pb-4">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('recentActivity')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <p className="font-medium">{activity.user}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                  {formatDateTime(activity.timestamp, locale)}
                </p>
              </div>
              <Badge variant={typeVariants[activity.type]}>{activity.type}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

