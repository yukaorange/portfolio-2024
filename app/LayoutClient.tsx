'use client';
import { useState, useEffect } from 'react';
import { RecoilRoot } from 'recoil';

import styles from '@/app/layout.module.scss';
import './global.scss';
import { ScrollProvider } from '@/app/ScrollContextProvider';
import { TransitionContextProvider } from '@/app/TransitionContextProvider';
import { TransitionOverlay } from '@/components/Common/TransitionOverlay/TransitionOverlay';
import { Drawer } from '@/components/Layout/Drawer/Drawer';
import { Footer } from '@/components/Layout/Footer/Footer';
import { Header } from '@/components/Layout/Header/Header';
import Loading from '@/components/Layout/Loading/Loading';
import { Filters } from '@/components/Layout/SVG/Filter/Filter';
import { InitializeNortification } from '@/components/Utility/initializeNortification';
import { UserAgent } from '@/components/Utility/UserAgent';
import { ViewPortCalculator } from '@/components/Utility/ViewportCalculator';
import { App } from '@/components/WebGL/App/App';
import { useNavigationAtomUpdater } from '@/hooks/useNavigationAtomUpdater';

import { ScrollVelocityProvider } from './ScrollVelocityProvider';

export const LayoutClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingStart, setIsLoadingStart] = useState(false);

  const NavigationHandler = () => {
    useNavigationAtomUpdater();
    return null;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // hydrationの不一致を防ぐため、マウント前は最小限のコンテンツのみレンダリング
  if (!isMounted) {
    return (
      <RecoilRoot>
        <div className={styles.layout}>
          <div className={styles.layout__preparing} />
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
                ></div>
                <UserAgent />
                <InitializeNortification />
                <ViewPortCalculator />
                <Loading setIsLoadingStart={setIsLoadingStart} />
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
