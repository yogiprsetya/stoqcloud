import useSWR from 'swr';
import { HttpResponse } from '~/types/Response';
import type { SelectSKU } from './schema';
import { useState } from 'react';

type Options = {
  disabled?: boolean;
};

type Params = {
  keyword?: string;
};

export const useFetchSku = (params?: Params, opt?: Options) => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'asc' | 'desc' | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | null>(null);

  const search = new URLSearchParams();

  if (params?.keyword) search.set('keyword', params.keyword);
  if (page) search.set('page', String(page));
  if (sort) search.set('sort', sort);
  if (sortBy) search.set('sortBy', sortBy);

  const key = opt?.disabled ? null : `sku${search.toString() ? `?${search.toString()}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR<HttpResponse<SelectSKU[]>>(key);

  return {
    skus: data?.data || null,
    meta: data?.meta,
    isLoading,
    error,
    mutate,
    setPage,
    setSort,
    setSortBy
  };
};
