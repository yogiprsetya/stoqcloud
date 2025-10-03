import useSWR from 'swr';
import { HttpResponse } from '~/types/Response';
import { SelectStockTransaction } from '~/app/manage/stock-out/schema';

export const useFindStockOut = (id: string | null) => {
  const key = id ? `stock-out/${id}` : null;

  const { data, error, isLoading, mutate } = useSWR<HttpResponse<SelectStockTransaction>>(key);

  return {
    transaction: data?.data || null,
    loading: isLoading,
    error: error?.message || null,
    mutate
  };
};
