'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Globe, User } from 'lucide-react';
import { Button } from '@/shared/atoms/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/atoms/Avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/atoms/Select';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';
import { useIsMounted } from '@/shared/hooks/useIsMounted';

export interface NavbarProps {
  appName: string;
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
  onSignOut: () => void;
  userName?: string;
  userAvatar?: string;
  className?: string;
}

export function Navbar({
  appName,
  currentLocale,
  onLocaleChange,
  onSignOut,
  userName = 'User',
  userAvatar,
  className,
}: NavbarProps) {
  const tAuth = useTranslations('auth');
  const router = useRouter();
  const isMounted = useIsMounted();

  const handleLocaleChange = (locale: string) => {
    onLocaleChange(locale);
    // Get current path without locale
    const currentPath = window.location.pathname.split('/').slice(2).join('/');
    router.push(`/${locale}/${currentPath}`);
  };

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={`/${currentLocale}/dashboard`} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">H</span>
            </div>
            <span className="text-lg font-semibold">{appName}</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Locale Selector - Only render on client to prevent hydration mismatch */}
          {isMounted ? (
            <Select value={currentLocale} onValueChange={handleLocaleChange}>
              <SelectTrigger className="w-[100px]" aria-label="Select language">
                <Globe className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="az">AZ</SelectItem>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="ru">RU</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="w-[100px] h-10 border border-input bg-background rounded-md" />
          )}

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:inline-block">{userName}</span>
          </div>

          {/* Sign Out */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSignOut}
            aria-label={tAuth('signOut')}
            title={tAuth('signOut')}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

