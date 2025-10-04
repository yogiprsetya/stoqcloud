import { useCallback, useState } from 'react';
import z from 'zod';
import { httpClient } from '~/config/http-client';
import { errorHandler } from '~/utils/error-handler';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { stockInFormSchema } from './schema';

type FormData = z.infer<typeof stockInFormSchema>;

export const useActionsStockIn = () => {
  const [isLoading, setLoading] = useState(false);

  const downloadDocument = useCallback((id: string) => {
    toast.loading('Mengunduh dokumen...', { id: 'download-stock-in' });

    return httpClient
      .get(`stock-in/${id}/document`, { responseType: 'blob' })
      .then((res) => {
        if (res.status < 200 || res.status >= 300) {
          throw new Error('Gagal mengunduh dokumen');
        }

        const disposition = (res.headers['content-disposition'] as string) || '';
        const match = disposition.match(/filename="?([^";]+)"?/i);
        const suggestedName = match?.[1] || 'stock-in-document.txt';

        const url = URL.createObjectURL(res.data as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = suggestedName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        toast.success('Dokumen berhasil diunduh', { id: 'download-stock-in' });
      })
      .catch(() => {
        toast.error('Gagal mengunduh dokumen', { id: 'download-stock-in' });
      });
  }, []);

  const createStockIn = useCallback((payload: FormData) => {
    setLoading(true);

    return httpClient
      .post('stock-in', {
        ...payload,
        unitPrice: payload.unitPrice.toString(),
        totalPrice: (payload.unitPrice * payload.quantity).toString()
      })
      .then((res) => {
        if (res.data.success) {
          toast.success('Stock-in created successfully!');
          mutate('stock-in');
        } else {
          toast.error(`Failed to create stock-in! Status: ${res.status}`);
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  const updateStockIn = useCallback((payload: FormData, id: string) => {
    setLoading(true);

    return httpClient
      .patch(`stock-in/${id}`, {
        ...payload,
        unitPrice: payload.unitPrice.toString(),
        totalPrice: (payload.unitPrice * payload.quantity).toString()
      })
      .then((res) => {
        if (res.data.success) {
          toast.success('Stock-in updated successfully!');
          mutate('stock-in');
        } else {
          toast.error(`Failed to update stock-in! Status: ${res.status}`);
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  const deleteStockIn = useCallback((id: string) => {
    setLoading(true);

    return httpClient
      .delete(`stock-in/${id}`)
      .then((res) => {
        if (res.data.success) {
          toast.success('Stock-in deleted successfully!');
          mutate('stock-in');
        } else {
          toast.error(`Failed to delete stock-in! Status: ${res.status}`);
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  return { isLoading, createStockIn, updateStockIn, deleteStockIn, downloadDocument };
};
