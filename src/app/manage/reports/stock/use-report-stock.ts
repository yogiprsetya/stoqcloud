import useSWR from 'swr';
import { HttpResponse } from '~/types/Response';
import { SelectReportStock } from './schema';
import { useState } from 'react';
import { useDebounce } from '~/hooks/use-debounce';

export const useReportStock = () => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'stock'>('name');

  const debouncedKeyword = useDebounce(keyword, 500);

  const query = new URLSearchParams();

  if (debouncedKeyword) query.set('keyword', debouncedKeyword);
  if (page) query.set('page', String(page));
  if (sort) query.set('sort', sort);
  if (sortBy) query.set('sortBy', sortBy);

  const key = `reports/stock?${query.toString()}`;

  const { data, isLoading, mutate } = useSWR<HttpResponse<SelectReportStock[]>>(key);

  return {
    data,
    meta: data?.meta,
    isLoading,
    mutate,
    setKeyword,
    setPage,
    setSort,
    setSortBy,
    keyword,
    page,
    sort,
    sortBy
  };
};
