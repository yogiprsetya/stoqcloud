import useSWR from 'swr';
import { HttpResponse } from '~/types/Response';
import { SelectStockTransaction } from '~/app/manage/stock-out/schema';
import { useState } from 'react';
import { useDebounce } from '~/hooks/use-debounce';

type Options = {
  disabled?: boolean;
};

export const useFetchStockOut = (opt?: Options) => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'asc' | 'desc' | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'documentNumber' | null>(null);

  const debouncedKeyword = useDebounce(keyword, 500);

  const search = new URLSearchParams();

  if (debouncedKeyword) search.set('keyword', debouncedKeyword);
  if (page) search.set('page', String(page));
  if (sort) search.set('sort', sort);
  if (sortBy) search.set('sortBy', sortBy);

  const key = opt?.disabled ? null : `stock-out?${search.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<HttpResponse<SelectStockTransaction[]>>(key);

  return {
    transactions: data?.data || null,
    meta: data?.meta,
    isLoading,
    error,
    mutate,
    setPage,
    setSort,
    setSortBy,
    setKeyword,
    keyword
  };
};
