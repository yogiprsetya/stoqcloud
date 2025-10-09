import { Download, Upload, Home, Settings, Users, BarChart3, Bell, type LucideIcon } from 'lucide-react';

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
    title: 'Reports',
    icon: BarChart3,
    children: [
      { title: 'Stock', href: '/manage/reports/stock' },
      { title: 'Transactions', href: '/manage/reports/transactions' }
    ]
  },
  {
    title: 'Alerts',
    icon: Bell,
    children: [{ title: 'Low Stock', href: '/manage/alerts/low-stock' }]
  },
  {
    title: 'Stock Out',
    href: '/manage/stock-out',
    icon: Upload
  },
  // {
  //   title: 'Check Stock',
  //   href: '/manage/stock',
  //   icon: Package
  // },
  {
    title: 'User Management',
    href: '/manage/users',
    icon: Users
  }
];
