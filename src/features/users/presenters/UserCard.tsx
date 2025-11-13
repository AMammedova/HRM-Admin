import * as React from 'react';
import { Mail, Phone, Briefcase, Building, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/atoms/Card';
import { Badge } from '@/shared/atoms/Badge';
import { Avatar, AvatarFallback } from '@/shared/atoms/Avatar';
import { User } from '../types/user.types';
import { formatDate } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

export interface UserCardProps {
  user: User;
  locale: string;
}

export function UserCard({ user, locale }: UserCardProps) {
  const t = useTranslations('users');

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">
              {user.firstName} {user.lastName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                {t(user.status)}
              </Badge>
              <span className="text-sm text-muted-foreground">{user.role}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>

          {user.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span>{user.department}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>{user.position}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {t('createdAt')}: {formatDate(user.createdAt, locale)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {t('updatedAt')}: {formatDate(user.updatedAt, locale)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

