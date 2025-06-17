import { useState, useCallback } from 'react';

interface ModalState<T> {
  isOpen: boolean;
  data: T | null;
}

export function useModalState<T = any>() {
  const [state, setState] = useState<ModalState<T>>({
    isOpen: false,
    data: null,
  });

  const open = useCallback((data: T | null = null) => {
    setState({ isOpen: true, data });
  }, []);

  const close = useCallback(() => {
    setState({ isOpen: false, data: null });
  }, []);

  return {
    isOpen: state.isOpen,
    data: state.data,
    open,
    close,
  };
}