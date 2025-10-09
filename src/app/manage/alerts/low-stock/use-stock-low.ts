import { useState } from 'react';
import useSWR from 'swr';
import { HttpResponse } from '~/types/Response';
import { LowStockRow } from '../schema';

export function useStockLow() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [threshold, setThreshold] = useState(10);

  const query = new URLSearchParams();
  if (keyword) query.set('keyword', keyword);
  if (page) query.set('page', String(page));
  if (sort) query.set('sort', sort);
  if (threshold !== undefined) query.set('threshold', String(threshold));

  const url = `alerts/low-stock?${query.toString()}`;

  const { data, isLoading, mutate } = useSWR<HttpResponse<LowStockRow[]>>(url);

  return {
    data,
    meta: data?.meta,
    isLoading,
    mutate,
    setKeyword,
    setPage,
    setSort,
    setThreshold,
    keyword,
    sort,
    threshold
  };
}
