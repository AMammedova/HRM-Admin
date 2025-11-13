'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { usersApi } from '../services/users.api';
import { UserForm } from '../presenters/UserForm';
import { UserFormData } from '@/validators/user.schema';
import { useToast } from '@/shared/hooks/useToast';

export interface UserFormContainerProps {
  userId?: string;
  locale: string;
}

export function UserFormContainer({ userId, locale }: UserFormContainerProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('users');
  const tCommon = useTranslations('common');

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getById(userId!),
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: t('createSuccess'),
        variant: 'default',
      });
      router.push(`/${locale}/users`);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: 'Failed to create user',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => usersApi.update(userId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      toast({
        title: t('updateSuccess'),
        variant: 'default',
      });
      router.push(`/${locale}/users`);
    },
    onError: () => {
      toast({
        title: tCommon('error'),
        description: 'Failed to update user',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: UserFormData) => {
    if (userId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCancel = () => {
    router.push(`/${locale}/users`);
  };

  if (userId && isLoadingUser) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">{tCommon('loading')}</p>
      </div>
    );
  }

  return (
    <UserForm
      initialData={user}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={createMutation.isPending || updateMutation.isPending}
    />
  );
}

