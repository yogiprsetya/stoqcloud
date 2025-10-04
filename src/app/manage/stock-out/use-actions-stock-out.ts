'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { httpClient } from '~/config/http-client';
import { mutate } from 'swr';
import { errorHandler } from '~/utils/error-handler';
import { StockOutFormData } from './schema';

export const useActionsStockOut = () => {
  const [isLoading, setLoading] = useState(false);

  const downloadDocument = useCallback((id: string) => {
    toast.loading('Mengunduh dokumen...', { id: 'download-stock-out' });

    return httpClient
      .get(`stock-out/${id}/document`, { responseType: 'blob' })
      .then((res) => {
        if (res.status < 200 || res.status >= 300) {
          throw new Error('Gagal mengunduh dokumen');
        }

        const disposition = (res.headers['content-disposition'] as string) || '';
        const match = disposition.match(/filename="?([^";]+)"?/i);
        const suggestedName = match?.[1] || 'stock-out-document.txt';

        const url = URL.createObjectURL(res.data as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = suggestedName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        toast.success('Dokumen berhasil diunduh', { id: 'download-stock-out' });
      })
      .catch(() => {
        toast.error('Gagal mengunduh dokumen', { id: 'download-stock-out' });
      });
  }, []);

  const createStockOut = useCallback((payload: StockOutFormData) => {
    setLoading(true);

    return httpClient
      .post('stock-out', {
        ...payload,
        unitPrice: payload.unitPrice.toString(),
        totalPrice: (payload.unitPrice * payload.quantity).toString()
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
        totalPrice: (payload.unitPrice * payload.quantity).toString()
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

  return { isLoading, createStockOut, updateStockOut, deleteStockOut, downloadDocument };
};
