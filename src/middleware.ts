import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: 'always',
});

const AUTH_COOKIE = 'hrm_auth';
const PUBLIC_AUTH_PATHS = ['/sign-in', '/select-company', '/forgot-password'];

function parseLocalePath(pathname: string): { locale: string; path: string } {
  const segments = pathname.split('/').filter(Boolean);
  const locales = routing.locales as readonly string[];

  if (segments.length > 0 && locales.includes(segments[0] as 'az' | 'en' | 'ru')) {
    const locale = segments[0];
    const rest = segments.slice(1);
    return { locale, path: rest.length ? `/${rest.join('/')}` : '/' };
  }

  return { locale: routing.defaultLocale, path: pathname };
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const locales = routing.locales as readonly string[];

  if (segments.length > 0 && !locales.includes(segments[0] as (typeof locales)[number])) {
    const rest = segments.length > 1 ? segments.slice(1).join('/') : segments[0];
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}/${rest}`, request.url));
  }

  const { locale, path } = parseLocalePath(pathname);
  const hasAuth = request.cookies.get(AUTH_COOKIE)?.value === '1';
  const isPublicAuthRoute = PUBLIC_AUTH_PATHS.includes(path);

  if (path === '/') {
    const target = hasAuth ? 'dashboard' : 'sign-in';
    return NextResponse.redirect(new URL(`/${locale}/${target}`, request.url));
  }

  if (!hasAuth && !isPublicAuthRoute) {
    return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url));
  }

  if (hasAuth && (path === '/sign-in' || path === '/select-company')) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
