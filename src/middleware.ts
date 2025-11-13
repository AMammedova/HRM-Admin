import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';


// Simple i18n middleware only - no auth check for now
const intlMiddleware = createMiddleware({
  locales: ["en", "az", "ru"],
  defaultLocale: "en",
  localePrefix: "always",
});
export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(az|en|ru)/:path*'],
};

