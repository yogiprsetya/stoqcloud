'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { httpClient } from '~/config/http-client';
import { mutate } from 'swr';
import { errorHandler } from '~/utils/error-handler';
import { StockOutFormData } from './schema';

export const useActionsStockOut = () => {
  const [isLoading, setLoading] = useState(false);

  const createStockOut = useCallback((payload: StockOutFormData) => {
    setLoading(true);

    return httpClient
      .post('stock-out', {
        ...payload,
        unitPrice: payload.unitPrice.toString(),
        totalPrice: payload.totalPrice.toString()
      })
      .then((res) => {
        if (res.data.success) {
          toast.success('Stock-out created successfully!');
          mutate('stock-out');
          mutate('stock?type=OUT');
          mutate('sku'); // Refresh SKU data to update stock
        } else {
          toast.error(`Failed to create stock-out! Status: ${res.status}`);
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  const updateStockOut = useCallback((payload: StockOutFormData, id: string) => {
    setLoading(true);

    return httpClient
      .patch(`stock-out/${id}`, {
        ...payload,
        unitPrice: payload.unitPrice.toString(),
        totalPrice: payload.totalPrice.toString()
      })
      .then((res) => {
        if (res.data.success) {
          toast.success('Stock-out updated successfully!');
          mutate('stock-out');
          mutate('stock?type=OUT');
          mutate('sku'); // Refresh SKU data to update stock
        } else {
          toast.error(`Failed to update stock-out! Status: ${res.status}`);
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  const deleteStockOut = useCallback((id: string) => {
    setLoading(true);

    return httpClient
      .delete(`stock-out/${id}`)
      .then((res) => {
        if (res.data.success) {
          toast.success('Stock-out deleted successfully!');
          mutate('stock-out');
          mutate('sku'); // Refresh SKU data to update stock
        } else {
          toast.error(`Failed to delete stock-out! Status: ${res.status}`);
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  return { isLoading, createStockOut, updateStockOut, deleteStockOut };
};
