import type { Metadata } from 'next';
import { AppLayout } from '~/components/layout/app-layout';
import dynamic from 'next/dynamic';
import { Skeleton } from '~/components/ui/skeleton';
import { headers } from 'next/headers';

const isMobileDevice = (userAgent: string) => {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
};

const Header = dynamic(() => import('./header').then((m) => m.SpaceHeader), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-16 max-md:hidden" />
});

const Toaster = dynamic(() => import('~/components/ui/sonner').then((m) => m.Toaster), {
  ssr: false
});

export const metadata: Metadata = {
  title: 'FormyGlow - Dashboard',
  description: 'Kelola skincare Anda dengan FormyGlow'
};

export default function SpaceLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';
  const domain = headersList.get('host') || '';
  const fullUrl = headersList.get('referer') || '';
  const [, pathname] = fullUrl.match(new RegExp(`https?:\/\/${domain}(.*)`)) || [];

  const isMobile = isMobileDevice(userAgent);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {!isMobile && pathname !== '/space' && <Header className="max-md:hiden" />}
        {children}
      </div>

      <Toaster />
    </AppLayout>
  );
}
