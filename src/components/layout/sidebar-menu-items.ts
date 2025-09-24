import { Package, Calendar, TrendingUp, Home } from 'lucide-react';

export const menuItems = [
  {
    title: 'Dashboard',
    href: '/space',
    icon: Home
  },
  {
    title: 'Inventory',
    href: '/space/inventory',
    icon: Package
  },
  {
    title: 'Routines',
    href: '/space/routines',
    icon: Calendar
  },
  {
    title: 'Progress',
    href: '/space/progress',
    icon: TrendingUp
  }
];
