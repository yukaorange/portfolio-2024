import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import { currentPageState } from '@/store/pageTitleAtom';

export const useTransitionAnimation = () => {
  const currentPage = useRecoilValue(currentPageState);
  const observePageTransitionRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (startTime === null) {
        startTime = time;
      }

      const progress = Math.min((time - startTime) / 1000, 1);
      observePageTransitionRef.current = progress;

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        observePageTransitionRef.current = 0;
        startTime = null;
      }
    };

    // Start the animation when the page changes
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentPage]);

  return observePageTransitionRef;
};
