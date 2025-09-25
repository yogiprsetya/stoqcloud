import { Package, Download, Upload, Home } from 'lucide-react';

export const menuItems = [
  {
    title: 'Dashboard',
    href: '/depot',
    icon: Home
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
