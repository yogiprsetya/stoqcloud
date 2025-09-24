'use client';

import dynamic from 'next/dynamic';
import { FC } from 'react';
import { LoadingProfilePicture } from '~/components/common/profile-picture';
import { cn } from '~/utils/css';

const ProfilePicture = dynamic(
  () => import('~/components/common/profile-picture').then((m) => m.ProfilePicture),
  {
    ssr: false,
    loading: () => <LoadingProfilePicture />
  }
);

type Props = {
  className?: string;
};

export const SpaceHeader: FC<Props> = ({ className }) => (
  <header
    className={cn('bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm dark:border-slate-700', className)}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <p className="font-semibold">Personal Space</p>

        <div className="flex items-center space-x-4">
          <ProfilePicture />
        </div>
      </div>
    </div>
  </header>
);
