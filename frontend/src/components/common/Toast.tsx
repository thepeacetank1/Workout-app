import { useToast, ToastId, UseToastOptions } from '@chakra-ui/react';
import { useCallback, useRef } from 'react';

interface ToastOptions extends Omit<UseToastOptions, 'status'> {
  title?: string;
  description?: string;
}

export interface ToastUtility {
  success: (options: ToastOptions) => ToastId;
  error: (options: ToastOptions) => ToastId;
  warning: (options: ToastOptions) => ToastId;
  info: (options: ToastOptions) => ToastId;
  close: (id: ToastId) => void;
  closeAll: () => void;
}

export const useAppToast = (): ToastUtility => {
  const toast = useToast();
  const toastIdRef = useRef<ToastId | null>(null);

  const success = useCallback(
    (options: ToastOptions) => {
      const id = toast({
        title: options.title || 'Success',
        description: options.description,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
        ...options,
      });
      toastIdRef.current = id;
      return id;
    },
    [toast]
  );

  const error = useCallback(
    (options: ToastOptions) => {
      const id = toast({
        title: options.title || 'Error',
        description: options.description || 'An unexpected error occurred',
        status: 'error',
        duration: 7000,
        isClosable: true,
        position: 'top',
        ...options,
      });
      toastIdRef.current = id;
      return id;
    },
    [toast]
  );

  const warning = useCallback(
    (options: ToastOptions) => {
      const id = toast({
        title: options.title || 'Warning',
        description: options.description,
        status: 'warning',
        duration: 6000,
        isClosable: true,
        position: 'top',
        ...options,
      });
      toastIdRef.current = id;
      return id;
    },
    [toast]
  );

  const info = useCallback(
    (options: ToastOptions) => {
      const id = toast({
        title: options.title || 'Info',
        description: options.description,
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top',
        ...options,
      });
      toastIdRef.current = id;
      return id;
    },
    [toast]
  );

  const close = useCallback(
    (id: ToastId) => {
      toast.close(id);
    },
    [toast]
  );

  const closeAll = useCallback(() => {
    toast.closeAll();
  }, [toast]);

  return { success, error, warning, info, close, closeAll };
};

export default useAppToast;