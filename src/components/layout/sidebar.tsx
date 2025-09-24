'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { LogOut } from 'lucide-react';
import { Logo } from '../common/logo';
import { menuItems } from './sidebar-menu-items';
import { cn } from '~/utils/css';

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Implementasi logout sesuai kebutuhan
    console.log('Logout clicked');
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen flex-shrink-0">
      {/* Header */}
      <div className="p-6 flex-shrink-0">
        <Logo />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                item.href === pathname
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-colors duration-200',
                  item.href === pathname
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 flex-shrink-0">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
