import { useState } from 'react';
import useSWR from 'swr';
import { HttpResponse } from '~/types/Response';
import { SelectReportTransactions } from './schema';

export function useReportTransactions() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'quantity'>('createdAt');
  const [type, setType] = useState<'IN' | 'OUT' | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [userId, setUserId] = useState('');

  const query = new URLSearchParams();

  if (keyword) query.set('keyword', keyword);
  if (page) query.set('page', String(page));
  if (sort) query.set('sort', sort);
  if (sortBy) query.set('sortBy', sortBy);
  if (type) query.set('type', type);
  if (startDate) query.set('startDate', startDate);
  if (endDate) query.set('endDate', endDate);
  if (categoryId) query.set('categoryId', categoryId);
  if (supplierId) query.set('supplierId', supplierId);
  if (userId) query.set('userId', userId);

  const url = `reports/transactions?${query.toString()}`;

  const { data, isLoading, mutate } = useSWR<HttpResponse<SelectReportTransactions[]>>(url);

  return {
    data,
    meta: data?.meta,
    isLoading,
    mutate,
    setKeyword,
    setPage,
    setSort,
    setSortBy,
    setType,
    type,
    setStartDate,
    setEndDate,
    setCategoryId,
    setSupplierId,
    setUserId,
    keyword,
    page,
    sort,
    sortBy,
    startDate,
    endDate,
    categoryId,
    supplierId,
    userId
  };
}
