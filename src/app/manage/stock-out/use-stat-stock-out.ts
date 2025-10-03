import useSWR from 'swr';
import { SelectStockTransaction } from '~/app/manage/stock-out/schema';
import { httpClient } from '~/config/http-client';

interface StockOutStats {
  todayItems: number;
  todayValue: number;
  pendingItems: number;
  monthlyItems: number;
}

// Custom fetcher untuk statistik
const statsFetcher = async (): Promise<StockOutStats> => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

  // Fetch data untuk hari ini
  const todayResponse = await httpClient.get(`stock-out?startDate=${startOfDay}`);
  const todayResult = todayResponse.data;

  // Fetch data untuk bulan ini
  const monthResponse = await httpClient.get(`stock-out?startDate=${startOfMonth}`);
  const monthResult = await monthResponse.data;

  if (!todayResult.success || !monthResult.success) {
    throw new Error('Failed to fetch stock statistics');
  }

  const todayTransactions = todayResult.data || [];
  const monthTransactions = monthResult.data || [];

  const todayItems = todayTransactions.reduce(
    (sum: number, t: SelectStockTransaction) => sum + t.quantity,
    0
  );
  const todayValue = todayTransactions.reduce(
    (sum: number, t: SelectStockTransaction) => sum + parseFloat(t.totalPrice),
    0
  );
  const monthlyItems = monthTransactions.reduce(
    (sum: number, t: SelectStockTransaction) => sum + t.quantity,
    0
  );

  return {
    todayItems,
    todayValue,
    pendingItems: 0, // Tidak ada pending untuk stock-out yang sudah tersimpan
    monthlyItems
  };
};

export const useStatStockOut = () => {
  const { data, error, isLoading, mutate } = useSWR<StockOutStats>('stock-out-stats', statsFetcher);

  return {
    stats: data || null,
    loading: isLoading,
    error: error?.message || null,
    mutate
  };
};
