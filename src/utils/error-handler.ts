import { type AxiosError } from 'axios';
import { toast } from 'sonner';

type ResponseType = {
  success: false;
  message: string;
  errors: Record<string, string>[];
};

export const errorHandler = (err: AxiosError<ResponseType>): AxiosError & { success: false } => {
  const data = err.response?.data;

  if (data?.message != undefined) {
    const msg = data?.errors.length
      ? typeof data?.errors === 'object'
        ? data?.errors.map((er) => er.message).join(' ')
        : data?.errors
      : data?.message;

    toast.error('Error occured', {
      description: msg,
      duration: 5000
    });
  }

  toast.error('Error', {
    description: 'Internal Server Error',
    duration: 5000
  });

  return { ...err, success: false };
};
