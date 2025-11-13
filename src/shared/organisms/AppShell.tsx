'use client';

import * as React from 'react';
import { Navbar, NavbarProps } from './Navbar';
import { Sidebar, SidebarProps } from './Sidebar';
import { cn } from '@/shared/lib/utils';

export interface AppShellProps {
  navbar: Omit<NavbarProps, 'className'>;
  sidebar: Omit<SidebarProps, 'className' | 'isCollapsed' | 'onToggle'>;
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ navbar, sidebar, children, className }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="relative min-h-screen">
      <Navbar {...navbar} />
      <Sidebar 
        {...sidebar} 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <main className={cn('pt-16 transition-all duration-300', isCollapsed ? 'ml-16' : 'ml-64', className)}>
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}

