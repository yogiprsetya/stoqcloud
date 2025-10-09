import useSWR from 'swr';
import { SelectAnalyticsDashboard } from './schema';

export const useAnalyticsDashboard = () => {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: SelectAnalyticsDashboard;
    message?: string;
  }>('analytics/dashboard');

  return {
    data: data?.data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    mutate
  };
};
