'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Building, UserCircle, Calendar, LucideIcon, ChevronLeft, FileText, FileCheck,ClipboardList,Megaphone } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/atoms/Button';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Building,
  UserCircle,
  Calendar,
  FileText,
  FileCheck,
  ClipboardList,
  Megaphone,
};

export interface SidebarItem {
  label: string;
  href: string;
  icon?: string;
}

export interface SidebarProps {
  items: SidebarItem[];
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ items, className, isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <nav className="flex h-full flex-col gap-2 p-2">
        {/* Toggle Button */}
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

        {/* Menu Items */}
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon ? iconMap[item.icon] : undefined;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'hover:bg-accent',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 text-white'
                  : 'text-muted-foreground',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

