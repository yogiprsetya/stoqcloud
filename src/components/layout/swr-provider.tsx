'use client';

import { FC, ReactNode } from 'react';
import { toast } from 'sonner';
import { SWRConfig, SWRConfiguration } from 'swr';
import { fetcher } from '~/config/http-client';

const swrOptions: SWRConfiguration = {
  fetcher,
  shouldRetryOnError: true,
  revalidateOnFocus: false,
  errorRetryInterval: 5000,
  onError: (error) => {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data routines';
    toast.error(message);
  }
};

export const SWRProvider: FC<{ children: ReactNode }> = (props) => (
  <SWRConfig value={swrOptions}>{props.children}</SWRConfig>
);
