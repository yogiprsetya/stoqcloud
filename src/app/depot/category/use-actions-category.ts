import { useCallback, useState } from 'react';
import z from 'zod';
import { httpClient } from '~/config/http-client';
import { errorHandler } from '~/utils/error-handler';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { categoryFormSchema } from './schema';

type FormData = z.infer<typeof categoryFormSchema>;

export const useActionsCategory = () => {
  const [isLoading, setLoading] = useState(false);

  const createCategory = useCallback((payload: FormData) => {
    setLoading(true);

    return httpClient
      .post('category', payload)
      .then((res) => {
        if (!res.data.success) {
          toast.error(`Error! status: ${res.status}`);
          return { success: false };
        }

        if (res.data.success) {
          toast.success('Category successfully created!');
          mutate('category');
          return { success: true };
        }

        toast.error('Failed to create category');
        return { success: false };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  const updateCategory = useCallback((payload: FormData, id: string) => {
    setLoading(true);

    return httpClient
      .patch(`category/${id}`, payload)
      .then((res) => {
        if (!res.data.success) {
          toast.error(`Error! status: ${res.status}`);
          return { success: false };
        }

        if (res.data.success) {
          toast.success('Category successfully updated!');
          mutate('category');
          return { success: true };
        }

        toast.error('Failed to update category');
        return { success: false };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setLoading(true);

    return httpClient
      .delete(`category/${id}`)
      .then((res) => {
        if (!res.data.success) {
          toast.error(`Error! status: ${res.status}`);
          return { success: false };
        }

        if (res.data.success) {
          toast.success('Category successfully deleted!');
          mutate('category');
          return { success: true };
        }

        toast.error('Failed to delete category');
        return { success: false };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  return { isLoading, createCategory, updateCategory, deleteCategory };
};
