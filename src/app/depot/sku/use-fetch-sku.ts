import useSWR from 'swr';
import { HttpResponse } from '~/types/Response';
import type { SelectSKU } from './schema';

export const useFetchSku = () => {
  const { data, error, isLoading, mutate } = useSWR<HttpResponse<SelectSKU[]>>('sku');

  return {
    skus: data?.data || null,
    isLoading,
    error,
    mutate
  };
};
