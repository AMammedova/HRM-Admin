'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building,
  Building2,
  UserCircle,
  Calendar,
  LucideIcon,
  ChevronLeft,
  ChevronDown,
  FileText,
  FileCheck,
  ClipboardList,
  Megaphone,
  Tags,
  Settings,
  PenLine,
  FileSignature,
  Phone,
  Landmark,
  MapPin,
  Plane,
  Briefcase,
  Network,
  Layers,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/atoms/Button';
import { usePermissionsContext } from '@/shared/context/PermissionsContext';
import type { Permission } from '@/shared/types/permissions';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Building,
  Building2,
  UserCircle,
  Calendar,
  FileText,
  FileCheck,
  ClipboardList,
  Megaphone,
  Tags,
  Settings,
  PenLine,
  FileSignature,
  Phone,
  Landmark,
  MapPin,
  Plane,
  Briefcase,
  Network,
  Layers,
};

export interface SidebarItem {
  label: string;
  href?: string;
  icon?: string;
  /** If set, the item is only shown when the user has this permission */
  permission?: Permission | string;
  children?: SidebarItem[];
}

export interface SidebarProps {
  items: SidebarItem[];
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const COMPANIES_NESTED_ROUTES = [
  '/companies/company-types',
  '/companies/settings',
  '/companies/signatures',
  '/companies/pdf-signatures',
  '/companies/phones',
];

function isNavItemActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (!pathname.startsWith(`${href}/`)) return false;

  if (href.endsWith('/companies')) {
    return !COMPANIES_NESTED_ROUTES.some((route) => pathname.includes(route));
  }

  return true;
}

function isGroupActive(pathname: string, item: SidebarItem): boolean {
  return (
    item.children?.some((child) => child.href && isNavItemActive(pathname, child.href)) ?? false
  );
}

function filterVisibleItems(
  items: SidebarItem[],
  hasPermission: (p: Permission | string) => boolean
): SidebarItem[] {
  return items
    .filter((item) => !item.permission || hasPermission(item.permission))
    .map((item) => ({
      ...item,
      children: item.children
        ? filterVisibleItems(item.children, hasPermission)
        : undefined,
    }))
    .filter((item) => item.href || (item.children && item.children.length > 0));
}

function SidebarLink({
  item,
  pathname,
  isCollapsed,
  nested = false,
}: {
  item: SidebarItem;
  pathname: string;
  isCollapsed: boolean;
  nested?: boolean;
}) {
  if (!item.href) return null;

  const isActive = isNavItemActive(pathname, item.href);
  const Icon = item.icon ? iconMap[item.icon] : undefined;

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-accent',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive
          ? 'bg-primary text-primary-foreground hover:bg-primary/90 text-white'
          : 'text-muted-foreground',
        isCollapsed && !nested && 'justify-center',
        nested && 'py-1.5 text-[13px]'
      )}
      title={isCollapsed && !nested ? item.label : undefined}
    >
      {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
      {(!isCollapsed || nested) && <span>{item.label}</span>}
    </Link>
  );
}

function SidebarGroup({
  item,
  pathname,
  isCollapsed,
}: {
  item: SidebarItem;
  pathname: string;
  isCollapsed: boolean;
}) {
  const groupActive = isGroupActive(pathname, item);
  const [open, setOpen] = React.useState(groupActive);
  const Icon = item.icon ? iconMap[item.icon] : undefined;

  React.useEffect(() => {
    if (groupActive) setOpen(true);
  }, [groupActive]);

  if (isCollapsed) {
    const firstChild = item.children?.[0];
    return (
      <Link
        href={firstChild?.href ?? '#'}
        className={cn(
          'flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-accent',
          groupActive
            ? 'bg-primary text-primary-foreground hover:bg-primary/90 text-white'
            : 'text-muted-foreground'
        )}
        title={item.label}
      >
        {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
      </Link>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-accent text-left',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          groupActive ? 'text-foreground' : 'text-muted-foreground'
        )}
        aria-expanded={open}
      >
        {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
        <span className="flex-1">{item.label}</span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && item.children && (
        <div className="ml-3 space-y-0.5 border-l pl-2">
          {item.children.map((child) =>
            child.href ? (
              <SidebarLink
                key={child.href}
                item={child}
                pathname={pathname}
                isCollapsed={isCollapsed}
                nested
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ items, className, isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { hasPermission } = usePermissionsContext();

  const visibleItems = filterVisibleItems(items, hasPermission);

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <nav className="flex h-full flex-col gap-2 overflow-y-auto p-2">
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              'mb-2 self-end transition-transform duration-300',
              isCollapsed && 'rotate-180'
            )}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {visibleItems.map((item) => {
          if (item.children && item.children.length > 0) {
            return <SidebarGroup key={item.label} item={item} pathname={pathname} isCollapsed={isCollapsed} />;
          }

          return (
            <SidebarLink
              key={item.href ?? item.label}
              item={item}
              pathname={pathname}
              isCollapsed={isCollapsed}
            />
          );
        })}
      </nav>
    </aside>
  );
}
