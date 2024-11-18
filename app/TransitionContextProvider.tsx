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
  notifyMountComplete: () => void;
  startTransition: () => void;
  mountCompletePromise: React.MutableRefObject<Promise<void> | null>;
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
  const mountCompleteResolver = useRef<(() => void) | null>(null);
  const mountCompletePromise = useRef<Promise<void> | null>(null);

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

  const startTransition = useCallback(() => {
    mountCompletePromise.current = new Promise<void>((resolve) => {
      // console.log('start transition and preparing resolver');

      mountCompleteResolver.current = resolve; //mountCompleteResolver()が呼ばれると、resolve()が起動し、Promiseが解決される。という仕組み
    });
  }, []);

  const increaseTransition = useCallback(() => {
    // console.log('increase transition');
    return animateProgress({
      progressRef: increaseProgress,
      start: 0,
      end: 1,
      duration: 500,
    });
  }, []);

  const decreaseTransition = useCallback(() => {
    // console.log('decrease transition');

    return animateProgress({
      progressRef: decreaseProgress,
      start: 1,
      end: 0,
      duration: 500,
    });
  }, []);

  const notifyMountComplete = useCallback(() => {
    // console.log('Mount complete notified');
    if (mountCompleteResolver.current) {
      // console.log('mountCompleteResolver.current is resolving');

      mountCompleteResolver.current(); //resolve is called
      mountCompleteResolver.current = null;
    }
  }, []);

  const value = {
    increaseProgress,
    decreaseProgress,
    isUnmounting,
    isMounting,
    isTransitioning,
    currentPageTitle,
    arrivaledPageTitle,
    startTransition,
    increaseTransition,
    decreaseTransition,
    notifyMountComplete,
    mountCompletePromise,
  };

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
};
