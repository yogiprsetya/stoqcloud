import { useState, useEffect } from 'react';
import { SelectSupplier } from '~/app/manage/supplier/schema';

interface UseSupplierReturn {
  suppliers: SelectSupplier[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSupplier(): UseSupplierReturn {
  const [suppliers, setSuppliers] = useState<SelectSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/supplier');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSuppliers(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch suppliers');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers
  };
}
