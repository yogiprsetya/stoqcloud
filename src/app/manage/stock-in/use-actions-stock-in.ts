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

  const createStockIn = useCallback((payload: FormData) => {
    setLoading(true);

    return httpClient
      .post('stock', { ...payload, type: 'IN' })
      .then((res) => {
        if (res.data.success) {
          toast.success('Stock-in created successfully!');
          mutate('stock?type=IN');
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
      .patch(`stock/${id}`, payload)
      .then((res) => {
        if (res.data.success) {
          toast.success('Stock-in updated successfully!');
          mutate('stock');
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
          mutate('stock');
        } else {
          toast.error(`Failed to delete stock-in! Status: ${res.status}`);
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  return { isLoading, createStockIn, updateStockIn, deleteStockIn };
};
