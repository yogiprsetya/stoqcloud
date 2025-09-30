import { useCallback, useState } from 'react';
import z from 'zod';
import { httpClient } from '~/config/http-client';
import { errorHandler } from '~/utils/error-handler';
import { formSchema } from './schema';
import { toast } from 'sonner';
import { mutate } from 'swr';

type FormData = z.infer<typeof formSchema>;

export const useSku = () => {
  const [isLoading, setLoading] = useState(false);

  const createSku = useCallback((payload: FormData) => {
    setLoading(true);

    return httpClient
      .post('sku', { ...payload, costPrice: payload.costPrice.toString() })
      .then((res) => {
        if (res.data.success) {
          toast.success('SKU successfully added to inventory!');
          mutate('sku');
        } else {
          toast.error(`Error! status: ${res.status}`);
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  const updateSku = useCallback((payload: FormData, id: string) => {
    setLoading(true);

    return httpClient
      .patch(`sku/${id}`, { ...payload, costPrice: payload.costPrice.toString() })
      .then((res) => {
        if (res.data.success) {
          toast.success('SKU successfully updated!');
          mutate('sku');
        } else {
          toast.error(`Error! status: ${res.status}`);
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  return { isLoading, createSku, updateSku };
};
