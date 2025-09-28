import useSWR from 'swr';
import { HttpResponse } from '~/types/Response';
import { SelectSupplier } from './schema';

type Options = {
  disabled?: boolean;
};

export const useFetchSupplier = (opt?: Options) => {
  const { data, error, isLoading, mutate } = useSWR<HttpResponse<SelectSupplier[]>>(
    opt?.disabled ? null : 'supplier'
  );

  return {
    suppliers: data?.data || null,
    isLoading,
    error,
    mutate
  };
};
