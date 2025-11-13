'use client';

import * as React from 'react';
import { Sidebar, SidebarProps } from './Sidebar';
import { cn } from '@/shared/lib/utils';

export interface SidebarWrapperProps extends Omit<SidebarProps, 'isCollapsed' | 'onToggle'> {
  children: React.ReactNode;
}

export function SidebarWrapper({ children, ...sidebarProps }: SidebarWrapperProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <>
      <Sidebar 
        {...sidebarProps} 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <main className={cn('pt-16 transition-all duration-300', isCollapsed ? 'ml-16' : 'ml-64')}>
        <div className="container py-6">{children}</div>
      </main>
    </>
  );
}

