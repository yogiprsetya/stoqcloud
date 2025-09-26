'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '~/components/ui/sheet';
import { Button } from '~/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { LoadingProfilePicture } from '../common/profile-picture';
import dynamic from 'next/dynamic';
import { menuItems } from './sidebar-menu-items';
import { cn } from '~/utils/css';
import { signOut } from 'next-auth/react';

const ProfilePicture = dynamic(
  () => import('~/components/common/profile-picture').then((m) => m.ProfilePicture),
  {
    ssr: false,
    loading: () => <LoadingProfilePicture />
  }
);

export function SidebarMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    signOut();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden border-sidebar-border hover:border-sidebar-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[280px] sm:w-[320px] bg-sidebar-background text-sidebar-foreground border-sidebar-border"
      >
        <SheetHeader className="pb-6 flex-row gap-3 space-y-0 border-b border-sidebar-border">
          <ProfilePicture />
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-sidebar-foreground">Depot</span>
            <span className="text-xs text-sidebar-foreground/70">StoqCloud</span>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100%-32px)]">
          {/* Menu Items */}
          <nav className="flex-1 space-y-1 pt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === pathname;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 group',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors duration-200',
                      isActive
                        ? 'text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground'
                    )}
                  />
                  <span className="flex-1">{item.title}</span>
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-sidebar-primary-foreground" />}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="pt-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-sidebar-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
