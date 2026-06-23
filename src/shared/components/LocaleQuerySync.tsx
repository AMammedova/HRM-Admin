'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { getLocaleFromPathname } from '@/shared/lib/apiLocale';

/**
 * Invalidates React Query cache when the URL locale segment changes,
 * so API data is refetched with the new Accept-Language header.
 */
export function LocaleQuerySync() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const prevLocale = useRef<string | null>(null);

  useEffect(() => {
    const locale = getLocaleFromPathname(pathname);

    if (prevLocale.current !== null && prevLocale.current !== locale) {
      queryClient.invalidateQueries();
    }

    prevLocale.current = locale;
  }, [pathname, queryClient]);

  return null;
}
