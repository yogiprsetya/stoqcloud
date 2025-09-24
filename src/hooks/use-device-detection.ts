'use client';

import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkDevice();

    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile };
};
