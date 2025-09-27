'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { Logo } from '../common/logo';
import { menuItems, MenuItem } from './sidebar-menu-items';
import { signOut } from 'next-auth/react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '~/components/ui/sidebar';

export function AppSidebar() {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const handleLogout = () => {
    signOut();
  };

  const toggleMenu = (menuTitle: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuTitle) ? prev.filter((title) => title !== menuTitle) : [...prev, menuTitle]
    );
  };

  const isMenuExpanded = (menuTitle: string) => {
    return expandedMenus.includes(menuTitle);
  };

  const isActivePath = (item: MenuItem) => {
    if (item.href) {
      return item.href === pathname;
    }
    if (item.children) {
      return item.children.some((child) => child.href === pathname);
    }
    return false;
  };

  // Auto-expand menu if current path matches any child
  useEffect(() => {
    const activeMenu = menuItems.find(
      (item) => item.children && item.children.some((child) => child.href === pathname)
    );

    if (activeMenu && !expandedMenus.includes(activeMenu.title)) {
      setExpandedMenus((prev) => [...prev, activeMenu.title]);
    }
  }, [pathname, expandedMenus]);

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isActive = isActivePath(item);
                const isExpanded = isMenuExpanded(item.title);

                if (hasChildren) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => toggleMenu(item.title)}
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Icon />
                        <span>{item.title}</span>
                        {isExpanded ? (
                          <ChevronDown className="ml-auto" />
                        ) : (
                          <ChevronRight className="ml-auto" />
                        )}
                      </SidebarMenuButton>

                      {isExpanded && (
                        <SidebarMenuSub>
                          {item.children!.map((child) => {
                            const isChildActive = child.href === pathname;

                            return (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton asChild isActive={isChildActive}>
                                  <Link href={child.href ?? ''}>{child.title}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.href ?? ''}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
