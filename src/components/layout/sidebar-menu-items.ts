import { Package, Download, Upload, Home, Settings, ChevronDown, ChevronRight } from 'lucide-react';

export interface MenuItem {
  title: string;
  href?: string;
  icon: any;
  children?: MenuItem[];
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
        href: '/depot/sku',
        icon: Package
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
    title: 'Cek Stok',
    href: '/depot/stock',
    icon: Package
  }
];
