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
    href: '/manage',
    icon: Home
  },
  {
    title: 'Master',
    icon: Settings,
    children: [
      {
        title: 'SKU',
        href: '/manage/sku'
      },
      {
        title: 'Category',
        href: '/manage/category'
      },
      {
        title: 'Supplier',
        href: '/manage/supplier'
      }
    ]
  },
  {
    title: 'Stock In',
    href: '/manage/stock-in',
    icon: Download
  },
  {
    title: 'Stock Out',
    href: '/manage/stock-out',
    icon: Upload
  },
  {
    title: 'Check Stock',
    href: '/manage/stock',
    icon: Package
  }
];
