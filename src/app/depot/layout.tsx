import type { Metadata } from 'next';
import { AppLayout } from '~/components/layout/app-layout';
import dynamic from 'next/dynamic';
import { Skeleton } from '~/components/ui/skeleton';
// import { headers } from 'next/headers';
// import { getServerSession } from 'next-auth';
// import { redirect } from 'next/navigation';
// import { authOptions } from '~/config/auth';

// const isMobileDevice = (userAgent: string) => {
//   const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
//   return mobileRegex.test(userAgent);
// };

const Header = dynamic(() => import('./header').then((m) => m.SpaceHeader), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-16 max-md:hidden" />
});

const Toaster = dynamic(() => import('~/components/ui/sonner').then((m) => m.Toaster), {
  ssr: false
});

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Kelola gudang'
};

export default async function DepotLayout({ children }: { children: React.ReactNode }) {
  // const headersList = headers();
  // const userAgent = headersList.get('user-agent') || '';
  // const domain = headersList.get('host') || '';
  // const fullUrl = headersList.get('referer') || '';

  // const isMobile = isMobileDevice(userAgent);

  return (
    <AppLayout>
      <Header />
      {children}
      <Toaster />
    </AppLayout>
  );
}
