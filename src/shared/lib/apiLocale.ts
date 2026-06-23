import { routing } from '@/i18n/routing';

export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];

  if ((routing.locales as readonly string[]).includes(locale)) {
    return locale;
  }

  return routing.defaultLocale;
}

export function getApiLocale(): string {
  if (typeof window === 'undefined') {
    return routing.defaultLocale;
  }

  return getLocaleFromPathname(window.location.pathname);
}
