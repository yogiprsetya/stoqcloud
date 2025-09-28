import useSWR from 'swr';
import { HttpResponse } from '~/types/Response';
import type { SelectSKU } from './schema';

type Options = {
  disabled?: boolean;
};

export const useFetchSku = (opt?: Options) => {
  const { data, error, isLoading, mutate } = useSWR<HttpResponse<SelectSKU[]>>(opt?.disabled ? null : 'sku');

  return {
    skus: data?.data || null,
    isLoading,
    error,
    mutate
  };
};
