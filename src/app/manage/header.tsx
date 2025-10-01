'use client';

import dynamic from 'next/dynamic';
import { LoadingProfilePicture } from '~/components/common/profile-picture';
import { SidebarTrigger } from '~/components/ui/sidebar';

const ProfilePicture = dynamic(
  () => import('~/components/common/profile-picture').then((m) => m.ProfilePicture),
  {
    ssr: false,
    loading: () => <LoadingProfilePicture />
  }
);

export const SpaceHeader = () => (
  <header className="bg-white md:mb-6 dark:bg-slate-9000 dark:border-slate-700">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <p className="font-semibold">Depot</p>
        </div>

        <div className="flex items-center space-x-4">
          <ProfilePicture />
        </div>
      </div>
    </div>
  </header>
);
