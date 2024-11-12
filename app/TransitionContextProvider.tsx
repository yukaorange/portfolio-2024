'use client';

import React, { createContext, useContext, useCallback, useRef } from 'react';

interface TransitionContextType {
  increaseProgress: React.RefObject<number>;
  decreaseProgress: React.RefObject<number>;
  isUnmounting: React.MutableRefObject<boolean>;
  isMounting: React.MutableRefObject<boolean>;
  isTransitioning: React.MutableRefObject<boolean>;
  currentPageTitle: React.MutableRefObject<string>;
  arrivaledPageTitle: React.MutableRefObject<string>;
  decreaseTransition: () => Promise<void>;
  increaseTransition: () => Promise<void>;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const useTransitionProgress = () => {
  const context = useContext(TransitionContext);

  if (!context) {
    throw new Error('useTransition must be used within a TransitionContextProvider');
  }

  return context;
};

interface TransitionProviderProps {
  children: React.ReactNode;
}
interface AnimateProps {
  progressRef: React.MutableRefObject<number>;
  start: number;
  end: number;
  duration: number;
}

export const TransitionContextProvider = ({ children }: TransitionProviderProps) => {
  const increaseProgress = useRef<number>(0);
  const decreaseProgress = useRef<number>(1);
  const isUnmounting = useRef<boolean>(false);
  const isMounting = useRef<boolean>(false);
  const isTransitioning = useRef<boolean>(false);
  const currentPageTitle = useRef<string>('');
  const arrivaledPageTitle = useRef<string>('');
  const lastUpdateTimeRef = useRef(0);
  const animationRef = useRef<number>();

  const animateProgress = ({ progressRef, start, end, duration }: AnimateProps): Promise<void> => {
    return new Promise((resolve) => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;

        const progress = Math.min(1, elapsedTime / duration);
        progressRef.current = start + (end - start) * progress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // console.log('progress complete : ', `${progressRef.current}`);
          resolve();
          // cancelAnimationFrame(animationRef.current as number);
        }
      };

      requestAnimationFrame(animate);
    });
  };

  const increaseTransition = useCallback(() => {
    return animateProgress({
      progressRef: increaseProgress,
      start: 0,
      end: 1,
      duration: 500,
    });
  }, []);

  const decreaseTransition = useCallback(() => {
    return animateProgress({
      progressRef: decreaseProgress,
      start: 1,
      end: 0,
      duration: 500,
    });
  }, []);

  const value = {
    increaseProgress,
    decreaseProgress,
    isUnmounting,
    isMounting,
    isTransitioning,
    currentPageTitle,
    arrivaledPageTitle,
    increaseTransition,
    decreaseTransition,
  };

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
};
