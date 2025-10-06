import useSWR from 'swr';
import { HttpResponse } from '~/types/Response';
import { SelectUser } from './schema';
import { useState } from 'react';
import { useDebounce } from '~/hooks/use-debounce';

type Options = {
  disabled?: boolean;
};

export const useFetchUser = (opt?: Options) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const search = new URLSearchParams();

  if (debouncedSearchTerm) search.set('keyword', debouncedSearchTerm);

  const key = opt?.disabled ? null : `users?${search.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<HttpResponse<SelectUser[]>>(key);

  return {
    users: data?.data || null,
    meta: data?.meta,
    isLoading,
    error,
    mutate,
    setSearchTerm,
    searchTerm
  };
};
