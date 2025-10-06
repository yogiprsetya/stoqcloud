import { useCallback, useState } from 'react';
import { httpClient } from '~/config/http-client';
import { errorHandler } from '~/utils/error-handler';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { SelectUser } from './schema';

interface UserFormData {
  name: string;
  email: string;
  role: SelectUser['role'];
}

export const useActionsUser = () => {
  const [isLoading, setLoading] = useState(false);

  const createUser = useCallback((payload: UserFormData) => {
    setLoading(true);

    return httpClient
      .post('/api/users', payload)
      .then((res) => {
        if (res.data.success) {
          toast.success('User added successfully');
          mutate((key) => typeof key === 'string' && key.startsWith('users'));
        } else {
          toast.error(res.data.message || 'Failed to add user');
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  const updateUser = useCallback((payload: UserFormData, id: string) => {
    setLoading(true);

    return httpClient
      .put(`/api/users/${id}`, payload)
      .then((res) => {
        if (res.data.success) {
          toast.success('User updated successfully');
          mutate((key) => typeof key === 'string' && key.startsWith('users'));
        } else {
          toast.error(res.data.message || 'Failed to update user');
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setLoading(true);

    return httpClient
      .delete(`/api/users/${id}`)
      .then((res) => {
        if (res.data.success) {
          toast.success('User deleted successfully');
          mutate((key) => typeof key === 'string' && key.startsWith('users'));
        } else {
          toast.error(res.data.message || 'Failed to delete user');
        }

        return { success: res.data.success };
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  return { isLoading, createUser, updateUser, deleteUser };
};
