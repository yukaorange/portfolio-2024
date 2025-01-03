'use client';

import React, { createContext, useContext, useCallback, useRef } from 'react';

interface TransitionContextType {
  singleProgress: React.RefObject<number>;
  isUnmounting: React.MutableRefObject<boolean>;
  isMounting: React.MutableRefObject<boolean>;
  isTransitioning: React.MutableRefObject<boolean>;
  currentPageTitle: React.MutableRefObject<string>;
  arrivaledPageTitle: React.MutableRefObject<string>;
  singleTransitionOut: () => Promise<void>;
  singleTransitionIn: () => Promise<void>;
  notifyMountComplete: () => void;
  startTransition: () => void;
  mountCompletePromise: React.MutableRefObject<Promise<void> | null>;
}

//このコンテキストは、ページのトランジションを司り、値の変遷は、TransitionLinkコンポーネントにロジックがあります。
//TransitionContext（コンテキスト作成）
//TransitionContextProvider（コンテキストをvalueとして供給）
//useTransitionProgress（コンテキストの値を抽出するフック）
const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

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
  const singleProgress = useRef<number>(0);
  const isUnmounting = useRef<boolean>(false);
  const isMounting = useRef<boolean>(false);
  const isTransitioning = useRef<boolean>(false);
  const currentPageTitle = useRef<string>('');
  const arrivaledPageTitle = useRef<string>('');
  const mountCompleteResolver = useRef<(() => void) | null>(null);
  const mountCompletePromise = useRef<Promise<void> | null>(null);

  //TrasnitionLink.tsxと連携し、ページ遷移時に使用する値の変遷を司る
  const animateProgress = ({ progressRef, start, end, duration }: AnimateProps): Promise<void> => {
    return new Promise((resolve) => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;

        const progress = Math.min(1, elapsedTime / duration);

        //startに指定した値から、endに指定した値まで、progressの値に沿って、変遷する常套テク
        progressRef.current = start + (end - start) * progress;

        //progressが完了するまでの間、ループ処理が続くようにする
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
      mountCompleteResolver.current = resolve; //mountCompleteResolver()が呼ばれると、resolve()が起動し、Promiseが解決される。結果、TransitionLinkのhandleTransitionが次の書に進む
    });
  }, []);

  const singleTransitionOut = useCallback(() => {
    return animateProgress({
      progressRef: singleProgress,
      start: 0,
      end: 1,
      duration: 500,
    });
  }, []);

  const singleTransitionIn = useCallback(() => {
    return animateProgress({
      progressRef: singleProgress,
      start: 1,
      end: 0,
      duration: 500,
    });
  }, []);

  const notifyMountComplete = useCallback(() => {
    // console.log('Mount complete notified');
    if (mountCompleteResolver.current) {
      // console.log('mountCompleteResolver.current is resolving');

      mountCompleteResolver.current(); //mountCompleteResolver()が呼ばれると、resolve()が起動し、Promiseが解決される。結果、TransitionLinkのhandleTransitionが次の書に進む
      mountCompleteResolver.current = null;
    }
  }, []);

  const value = {
    singleProgress,
    isUnmounting,
    isMounting,
    isTransitioning,
    currentPageTitle,
    arrivaledPageTitle,
    startTransition,
    singleTransitionOut,
    singleTransitionIn,
    notifyMountComplete,
    mountCompletePromise,
  };

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
};

export const useTransitionProgress = () => {
  const context = useContext(TransitionContext);

  if (!context) {
    throw new Error('useTransition must be used within a TransitionContextProvider');
  }

  return context;
};
