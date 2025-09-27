import { useCallback, useState } from 'react';
import z from 'zod';
import { httpClient } from '~/config/http-client';
import { errorHandler } from '~/utils/error-handler';
import { formSchema } from './schema';
import { toast } from 'sonner';

type FormData = z.infer<typeof formSchema>;

export const useSku = () => {
  const [isLoading, setLoading] = useState(false);

  const createSku = useCallback((payload: FormData) => {
    setLoading(false);

    return httpClient
      .post('sku', payload)
      .then((res) => {
        if (!res.data.success) {
          toast.error(`Error! status: ${res.status}`);
          return { success: false };
        }

        if (res.data.success) {
          toast.success('SKU berhasil ditambahkan ke inventory!');
          return { success: true };
        }

        toast.error('Gagal menambahkan SKU');
        return { success: false };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  const updateSku = useCallback((payload: FormData, id: string) => {
    setLoading(false);

    return httpClient
      .patch(`sku/${id}`, payload)
      .then((res) => {
        if (!res.data.success) {
          toast.error(`Error! status: ${res.status}`);
          return { success: false };
        }

        if (res.data.success) {
          toast.success('SKU berhasil diubah!');
          return { success: true };
        }

        toast.error('Gagal menyimpan SKU');
        return { success: false };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  return { isLoading, createSku, updateSku };
};
