import useSWR from 'swr';

interface LowStockItem {
  id: string;
  name: string;
  skuCode: string;
  stock: number;
}

interface MostOutboundItem {
  skuId: string;
  skuCode: string;
  name: string;
  quantity: number;
}

export interface AnalyticsDashboardResponse {
  totalStock: number;
  lowStock: LowStockItem[];
  mostOutbound: MostOutboundItem[];
  inventoryValue: number;
  totalOutboundThisMonth: number;
}

export const useAnalyticsDashboard = () => {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: AnalyticsDashboardResponse;
    message?: string;
  }>('analytics/dashboard');

  return {
    data: data?.data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    mutate
  };
};
