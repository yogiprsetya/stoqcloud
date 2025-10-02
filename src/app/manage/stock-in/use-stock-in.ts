import { useState, useEffect } from 'react';
import { SelectStockTransaction } from '~/app/manage/stock-in/schema';

// Hook untuk mengambil statistik stock-in
interface StockInStats {
  todayItems: number;
  todayValue: number;
  pendingItems: number;
  monthlyItems: number;
}

interface UseStockInStatsReturn {
  stats: StockInStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStockInStats(): UseStockInStatsReturn {
  const [stats, setStats] = useState<StockInStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

      // Fetch data untuk hari ini
      const todayResponse = await fetch(`/api/stock-in?type=IN&startDate=${startOfDay}`);
      const todayResult = await todayResponse.json();

      // Fetch data untuk bulan ini
      const monthResponse = await fetch(`/api/stock-in?type=IN&startDate=${startOfMonth}`);
      const monthResult = await monthResponse.json();

      if (todayResult.success && monthResult.success) {
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

        setStats({
          todayItems,
          todayValue,
          pendingItems: 0, // Tidak ada pending untuk stock-in yang sudah tersimpan
          monthlyItems
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}

// Hook untuk mengambil detail stock-in transaction
interface UseStockInDetailReturn {
  transaction: SelectStockTransaction | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStockInDetail(id: string | null): UseStockInDetailReturn {
  const [transaction, setTransaction] = useState<SelectStockTransaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = async () => {
    if (!id) {
      setTransaction(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/stock-in/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch stock-in detail');
      }

      setTransaction(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setTransaction(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  return {
    transaction,
    loading,
    error,
    refetch: fetchDetail
  };
}
