'use client';

import GSAP from 'gsap';
import { useState, useRef, useEffect } from 'react';
import { RecoilRoot } from 'recoil';

import styles from '@/app/layout.module.scss';
import './global.scss';

import { TransitionContextProvider } from '@/app/TransitionContextProvider';
import { Drawer } from '@/components/Layout/Drawer/Drawer';
import { Footer } from '@/components/Layout/Footer/Footer';
import { Header } from '@/components/Layout/Header/Header';
import { Loading } from '@/components/Layout/Loading/Loading';
import { ViewPortCalculator } from '@/components/Utility/ViewportCalculator';
import { Filters } from '@/components/Layout/SVG/Filter/Filter';
import { UserAgent } from '@/components/Utility/UserAgent';
import { TransitionOverlay } from '@/components/Common/TransitionOverlay/TransitionOverlay';
import { Experience } from '@/components/Layout/WebGL/Experience/Experience';

export const LayoutClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const loadingRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // try {
      // } catch (err) {
      //   console.error('Error fetching data:', err);
      // } finally {
      // }
      if (loadingRef.current) {
        GSAP.to(loadingRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setIsLoading(false);
            setIsMounted(true);
          },
        });
      }
    };

    loadData();
  }, []);

  return (
    <>
      <RecoilRoot>
        {isLoading ? (
          <Loading ref={loadingRef} />
        ) : (
          <TransitionContextProvider>
            <div className={styles.layout}>
              <UserAgent />
              {isMounted && <ViewPortCalculator />}
              <Header />
              <Drawer />
              <Filters />
              <TransitionOverlay />
              <div className={`${styles.layout__content} layout__content`}>{children}</div>
              <div className={styles.layout__webgl}>
                <Experience />
              </div>
              <Footer />
            </div>
          </TransitionContextProvider>
        )}
      </RecoilRoot>
    </>
  );
};
