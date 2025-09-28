import { Package, Download, Upload, Home, Settings, type LucideIcon } from 'lucide-react';

export interface MenuItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  children?: Omit<MenuItem, 'icon'>[];
}

export const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/depot',
    icon: Home
  },
  {
    title: 'Master',
    icon: Settings,
    children: [
      {
        title: 'SKU',
        href: '/depot/sku'
      },
      {
        title: 'Category',
        href: '/depot/category'
      },
      {
        title: 'Supplier',
        href: '/depot/supplier'
      }
    ]
  },
  {
    title: 'Stock In',
    href: '/depot/stock-in',
    icon: Download
  },
  {
    title: 'Stock Out',
    href: '/depot/stock-out',
    icon: Upload
  },
  {
    title: 'Check Stock',
    href: '/depot/stock',
    icon: Package
  }
];
