'use client';

import * as React from 'react';
import { usePermissionsContext } from '@/shared/context/PermissionsContext';
import type { Permission } from '@/shared/types/permissions';

interface PermissionGuardProps {
  /** Single permission required to render children */
  permission?: Permission | string;
  /** Multiple permissions — use requireAll to toggle AND/OR logic */
  permissions?: (Permission | string)[];
  /** When true, ALL permissions are required (AND). Default: false (OR) */
  requireAll?: boolean;
  /** Rendered when the user lacks permission. Defaults to null */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Conditionally renders children based on the user's permissions.
 *
 * @example
 * // Single permission
 * <PermissionGuard permission={PERMISSIONS.CONTRACTS.VIEW}>
 *   <ContractsTable />
 * </PermissionGuard>
 *
 * @example
 * // Any of multiple permissions
 * <PermissionGuard permissions={[PERMISSIONS.CONTRACTS.VIEW, PERMISSIONS.ORDERS.VIEW]}>
 *   <SomeSection />
 * </PermissionGuard>
 *
 * @example
 * // Custom fallback
 * <PermissionGuard permission={PERMISSIONS.USERS.DELETE} fallback={<p>No access</p>}>
 *   <DeleteButton />
 * </PermissionGuard>
 */
export function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissionsContext();

  const allowed = React.useMemo(() => {
    if (permission) return hasPermission(permission);
    if (permissions && permissions.length > 0) {
      return requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
    }
    return true;
  }, [permission, permissions, requireAll, hasPermission, hasAnyPermission, hasAllPermissions]);

  return allowed ? <>{children}</> : <>{fallback}</>;
}
