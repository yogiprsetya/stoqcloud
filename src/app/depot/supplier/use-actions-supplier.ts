import { useCallback, useState } from 'react';
import z from 'zod';
import { httpClient } from '~/config/http-client';
import { errorHandler } from '~/utils/error-handler';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { supplierFormSchema } from './schema';

type FormData = z.infer<typeof supplierFormSchema>;

export const useActionsSupplier = () => {
  const [isLoading, setLoading] = useState(false);

  const createSupplier = useCallback((payload: FormData) => {
    setLoading(true);

    return httpClient
      .post('supplier', payload)
      .then((res) => {
        if (res.data.success) {
          toast.success('Supplier successfully created!');
          mutate('supplier');
        } else {
          toast.error(`Error! status: ${res.status}`);
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  const updateSupplier = useCallback((payload: FormData, id: string) => {
    setLoading(true);

    return httpClient
      .patch(`supplier/${id}`, payload)
      .then((res) => {
        if (res.data.success) {
          toast.success('Supplier successfully updated!');
          mutate('supplier');
        } else {
          toast.error(`Error! status: ${res.status}`);
        }

        toast.error('Failed to update supplier');
        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  const deleteSupplier = useCallback((id: string) => {
    setLoading(true);

    return httpClient
      .delete(`supplier/${id}`)
      .then((res) => {
        if (res.data.success) {
          toast.success('Supplier successfully deleted!');
          mutate('supplier');
        } else {
          toast.error(`Error! status: ${res.status}`);
        }

        toast.error('Failed to delete supplier');
        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  return { isLoading, createSupplier, updateSupplier, deleteSupplier };
};
