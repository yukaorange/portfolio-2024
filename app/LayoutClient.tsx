'use client';

import GSAP from 'gsap';
import { useState, useRef, useEffect } from 'react';
import { RecoilRoot } from 'recoil';

import { Header } from '@/components/Layout/Header/Header';
import { Loading } from '@/components/Layout/Loading/Loading';
// import { GlitchFilters } from '@/components/Layout/SVG/Glitch/Glictch';
import { ViewPortCalculator } from '@/components/Utility/ViewportCalculator';

export const LayoutClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const loadingRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // await fetchUserData();
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
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
          <div className="layout">
            {isMounted && <ViewPortCalculator />}
            <Header />
            {/* <GlitchFilters /> */}
            {children}
          </div>
        )}
      </RecoilRoot>
    </>
  );
};
