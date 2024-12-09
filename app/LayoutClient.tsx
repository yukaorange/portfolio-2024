'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Lottie from 'react-lottie-player';
import { RecoilRoot } from 'recoil';

import styles from '@/app/layout.module.scss';
import './global.scss';
import { ScrollProvider } from '@/app/ScrollContextProvider';
import { TransitionContextProvider } from '@/app/TransitionContextProvider';
import { TransitionOverlay } from '@/components/Common/TransitionOverlay/TransitionOverlay';
import { Drawer } from '@/components/Layout/Drawer/Drawer';
import { Footer } from '@/components/Layout/Footer/Footer';
import { Header } from '@/components/Layout/Header/Header';
import { Filters } from '@/components/Layout/SVG/Filter/Filter';
import { InitializeNortification } from '@/components/Utility/initializeNortification';
import { UserAgent } from '@/components/Utility/UserAgent';
import { ViewPortCalculator } from '@/components/Utility/ViewportCalculator';
import { App } from '@/components/WebGL/App/App';
import { useNavigationAtomUpdater } from '@/hooks/useNavigationAtomUpdater';
import lottieJson from '@/public/json/data.json';

import { ScrollVelocityProvider } from './ScrollVelocityProvider';

//動的に読み込むことでdocumentの参照エラーを回避したい(gsapのエラーが出るため)
const Loading = dynamic(() => import('@/components/Layout/Loading/Loading'), {
  ssr: false,
  loading: () => <></>,
});

export const LayoutClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingStart, setIsLoadingStart] = useState(false);

  const NavigationHandler = () => {
    useNavigationAtomUpdater();
    return null;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  // hydrationの不一致を防ぐため、マウント前は最小限のコンテンツのみレンダリング
  if (!isMounted) {
    return (
      <RecoilRoot>
        <div className={styles.layout}>
          <div className={styles.layout__preparing} />
          <div className={styles.lottie}>
            <div className={styles.lottie__icon}>
              <Lottie loop play animationData={lottieJson} />
            </div>
          </div>
        </div>
      </RecoilRoot>
    );
  }

  return (
    <>
      <RecoilRoot>
        <TransitionContextProvider>
          <ScrollProvider>
            <ScrollVelocityProvider>
              <NavigationHandler />
              <div className={`${styles.layout}`}>
                <div
                  className={`${styles.layout__preparing} ${isLoadingStart && styles.is_mounted}`}
                >
                  <div className={styles.lottie}>
                    <div className={styles.lottie__icon}>
                      <Lottie loop play animationData={lottieJson} />
                    </div>
                  </div>
                </div>
                <UserAgent />
                <InitializeNortification />
                {typeof window !== 'undefined' && isMounted && (
                  <>
                    <ViewPortCalculator />
                    <Loading setIsLoadingStart={setIsLoadingStart} />
                  </>
                )}
                <Header />
                <Drawer />
                <Filters />
                <TransitionOverlay />
                <div className={`${styles.layout__content} layout__content`}>
                  {isMounted && children}
                </div>
                <div className={styles.layout__webgl}>
                  <App />
                </div>
                <Footer />
              </div>
            </ScrollVelocityProvider>
          </ScrollProvider>
        </TransitionContextProvider>
      </RecoilRoot>
    </>
  );
};
