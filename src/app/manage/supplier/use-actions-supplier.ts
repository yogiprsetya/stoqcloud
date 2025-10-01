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
          toast.success('Supplier created successfully!');
          mutate('supplier');
        } else {
          toast.error(`Failed to create supplier! Status: ${res.status}`);
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
          toast.success('Supplier updated successfully!');
          mutate('supplier');
        } else {
          toast.error(`Failed to update supplier! Status: ${res.status}`);
        }

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
          toast.success('Supplier deleted successfully!');
          mutate('supplier');
        } else {
          toast.error(`Failed to delete supplier! Status: ${res.status}`);
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  return { isLoading, createSupplier, updateSupplier, deleteSupplier };
};
