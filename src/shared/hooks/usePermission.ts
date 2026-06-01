'use client';

import { usePermissionsContext } from '@/shared/context/PermissionsContext';
import type { Permission } from '@/shared/types/permissions';

/**
 * Returns true if the current user has the given permission.
 *
 * @example
 * const canView = usePermission(PERMISSIONS.CONTRACTS.VIEW);
 */
export function usePermission(permission: Permission | string): boolean {
  return usePermissionsContext().hasPermission(permission);
}

/**
 * Returns true if the user has at least one of the given permissions.
 */
export function useAnyPermission(permissions: (Permission | string)[]): boolean {
  return usePermissionsContext().hasAnyPermission(permissions);
}

/**
 * Returns true if the user has ALL of the given permissions.
 */
export function useAllPermissions(permissions: (Permission | string)[]): boolean {
  return usePermissionsContext().hasAllPermissions(permissions);
}

/**
 * Returns the full context: permissions array + helper functions.
 */
export { usePermissionsContext as usePermissions } from '@/shared/context/PermissionsContext';
