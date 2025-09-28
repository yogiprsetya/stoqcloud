import useSWR from 'swr';
import { HttpResponse } from '~/types/Response';
import { SelectCategory } from './schema';

type Options = {
  disabled?: boolean;
};

export const useFetchCategory = (opt?: Options) => {
  const { data, error, isLoading, mutate } = useSWR<HttpResponse<SelectCategory[]>>(
    opt?.disabled ? null : 'category'
  );

  return {
    categories: data?.data || null,
    isLoading,
    error,
    mutate
  };
};
