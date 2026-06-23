'use client';

import { tokenStorage } from '@/shared/lib/tokenStorage';

/**
 * Returns the company ID from the current access token (set after login / company selection).
 */
export function useCompanyId(): number | null {
  return tokenStorage.getCompanyId();
}
