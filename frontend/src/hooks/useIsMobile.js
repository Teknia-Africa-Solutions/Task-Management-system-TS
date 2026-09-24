// frontend/src/hooks/useIsMobile.js

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if viewport is mobile (< 768px)
 * Returns: isMobile (boolean)
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};