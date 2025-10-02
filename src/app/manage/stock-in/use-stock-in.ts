import { useState, useEffect } from 'react';
import { StockInFormData } from '~/app/manage/stock-in/schema';

// Types untuk API response
export interface StockInTransaction {
  id: string;
  skuId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  documentNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  sku: {
    id: string;
    skuCode: string;
    name: string;
    categoryName: string | null;
    supplierName: string | null;
  };
}

interface StockInListResponse {
  success: boolean;
  data: StockInTransaction[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

interface UseStockInListParams {
  keyword?: string;
  page?: number;
  sort?: 'asc' | 'desc';
  sortBy?: 'createdAt' | 'documentNumber';
}

interface UseStockInListReturn {
  transactions: StockInTransaction[];
  loading: boolean;
  error: string | null;
  meta: StockInListResponse['meta'] | null;
  refetch: () => void;
}

interface UseStockInSubmitReturn {
  submitStockIn: (data: StockInFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useStockInSubmit(): UseStockInSubmitReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitStockIn = async (data: StockInFormData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/stock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          type: 'IN' // Pastikan type adalah IN untuk stock-in
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create stock-in');
      }

      // Success - data tersimpan
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err; // Re-throw untuk handling di component
    } finally {
      setLoading(false);
    }
  };

  return {
    submitStockIn,
    loading,
    error
  };
}

// Hook untuk mengambil list stock-in transactions
export function useStockInList(params: UseStockInListParams = {}): UseStockInListReturn {
  const [transactions, setTransactions] = useState<StockInTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<StockInListResponse['meta'] | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const searchParams = new URLSearchParams();
      if (params.keyword) searchParams.set('keyword', params.keyword);
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.sort) searchParams.set('sort', params.sort);
      if (params.sortBy) searchParams.set('sortBy', params.sortBy);
      // Filter hanya untuk type IN (stock-in)
      searchParams.set('type', 'IN');

      const response = await fetch(`/api/stock-in?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: StockInListResponse = await response.json();

      if (!result.success) {
        throw new Error('Failed to fetch stock-in data');
      }

      setTransactions(result.data);
      setMeta(result.meta);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setTransactions([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [params.keyword, params.page, params.sort, params.sortBy]);

  return {
    transactions,
    loading,
    error,
    meta,
    refetch: fetchTransactions
  };
}

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
          (sum: number, t: StockInTransaction) => sum + t.quantity,
          0
        );
        const todayValue = todayTransactions.reduce(
          (sum: number, t: StockInTransaction) => sum + parseFloat(t.totalPrice),
          0
        );
        const monthlyItems = monthTransactions.reduce(
          (sum: number, t: StockInTransaction) => sum + t.quantity,
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
  transaction: StockInTransaction | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStockInDetail(id: string | null): UseStockInDetailReturn {
  const [transaction, setTransaction] = useState<StockInTransaction | null>(null);
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
