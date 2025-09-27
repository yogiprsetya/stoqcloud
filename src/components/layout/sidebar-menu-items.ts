import { Package, Download, Upload, Home, Settings, ChevronDown, ChevronRight } from 'lucide-react';

export interface MenuItem {
  title: string;
  href?: string;
  icon: any;
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
