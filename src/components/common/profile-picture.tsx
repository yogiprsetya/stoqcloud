'use client';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { Skeleton } from '../ui/skeleton';

export const ProfilePicture = () => {
  const { data: session } = useSession();

  return (
    <Avatar className="w-10 h-10 ring-2 ring-primary/20 shadow-sm">
      <AvatarImage src={session?.user?.image ?? ''} alt={session?.user?.name || 'User'} />

      <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200">
        {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </AvatarFallback>
    </Avatar>
  );
};

export const LoadingProfilePicture = () => <Skeleton className="w-10 h-10 rounded-full" />;
