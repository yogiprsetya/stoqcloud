import useSWR from 'swr';
import { HttpResponse } from '~/types/Response';
import { SelectStockTransaction } from '~/app/manage/stock-in/schema';
import { useState } from 'react';

type Options = {
  disabled?: boolean;
};

export const useFetchStockIn = (opt?: Options) => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'asc' | 'desc' | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'documentNumber' | null>(null);

  const search = new URLSearchParams();

  if (keyword) search.set('keyword', keyword);
  if (page) search.set('page', String(page));
  if (sort) search.set('sort', sort);
  if (sortBy) search.set('sortBy', sortBy);
  search.set('type', 'IN');

  const key = opt?.disabled ? null : `stock?${search.toString()}`;

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
