// frontend/src/hooks/useToast.js

import { useState, useCallback } from 'react';

/**
 * Custom hook to manage toast notifications
 * Returns: { toastMessage, toastType, showToast }
 */
export const useToast = () => {
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = useCallback((message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  return { toastMessage, toastType, showToast };
};