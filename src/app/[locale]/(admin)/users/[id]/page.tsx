'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/atoms/Button';
import { PageHeader } from '@/shared/organisms/PageHeader';
import { UserCard } from '@/features/users/presenters/UserCard';
import { usersApi } from '@/features/users/services/users.api';

export default function UserDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = useTranslations('users');
  const tCommon = useTranslations('common');

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getById(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">{tCommon('loading')}</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-destructive">{tCommon('error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('userDetails')}
        action={
          <div className="flex gap-2">
            <Link href={`/${locale}/users`}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {tCommon('back')}
              </Button>
            </Link>
            <Link href={`/${locale}/users/${id}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                {tCommon('edit')}
              </Button>
            </Link>
          </div>
        }
      />
      <UserCard user={user} locale={locale} />
    </div>
  );
}

