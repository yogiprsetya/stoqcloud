'use client';

import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '~/components/ui/sidebar';
import { AppSidebar } from './sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background overflow-hidden w-full">
        {/* Desktop Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <SidebarInset>
          {/* Page Content - Scrollable */}
          <main className="flex-1 px-4 pb-4 md:px-6 md:pb-6 overflow-y-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
