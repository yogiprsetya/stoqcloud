'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { SidebarMenu } from './sidebar-menu';
import { Logo } from '../common/logo';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Mobile Header with Menu Button */}
        <header className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border flex-shrink-0">
          <Logo />
          <SidebarMenu />
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
