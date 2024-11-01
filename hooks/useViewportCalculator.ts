'use client';

import { useEffect, useRef } from 'react';

export const useViewportCalculator = (): void => {
  const headerRef = useRef<HTMLElement>();

  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      headerRef.current = document.querySelector('[data-ui="header"]') as HTMLElement;

      const documentWidth = document.documentElement.clientWidth;

      const scrollBarWidth = vw - documentWidth;

      const adustmentwidth = vw - scrollBarWidth;

      const headerRect = headerRef.current.getBoundingClientRect();
      const headerHeight = headerRect.height;

      document.documentElement.style.setProperty('--vw', `${adustmentwidth}px`);

      document.documentElement.style.setProperty('--vh', `${vh}px`);

      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
};
