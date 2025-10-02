import { useState, useEffect } from 'react';
import { SelectSKU } from '~/app/manage/sku/schema';

interface UseSkuReturn {
  skus: SelectSKU[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSku(): UseSkuReturn {
  const [skus, setSkus] = useState<SelectSKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/sku');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSkus(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch SKUs');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching SKUs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkus();
  }, []);

  return {
    skus,
    loading,
    error,
    refetch: fetchSkus
  };
}
