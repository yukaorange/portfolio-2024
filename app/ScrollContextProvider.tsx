import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import * as THREE from 'three';

import { currentPageState } from '@/store/pageTitleAtom';

const ScrollContext = createContext({
  position: { current: 0 },
  ratio: { current: 0 },
  indicatorOfScrollStart: false,
  indicatorOfScrollEnd: false,
  indicatorIsGallerySection: false,
}); //refオブジェクトを渡すので、{ current: 0 }はRefオブジェクトのこと。使用するときは、 const { position: scroll, ratio: scrollRatio } = useScroll();として取り出して、scroll.currentのように使う。

interface ScrollProviderProps {
  children: React.ReactNode;
}

export const ScrollProvider = ({ children }: ScrollProviderProps) => {
  const scrollRef = useRef<number>(0);
  const scrollRatioRef = useRef<number>(0);
  // const indicatorOfScrollStartRef = useRef<boolean>(false);
  const [indicatorOfScrollStart, setIndicatorOfScrollStart] = useState<boolean>(false);
  const [indicatorIsGallerySection, setIndicatorIsGallerySection] = useState<boolean>(false);
  const [indicatorOfScrollEnd, setIndicatorOfScrollEnd] = useState<boolean>(false);

  const gallerySectionScrollYRef = useRef<number>(0);
  const currentPage = useRecoilValue(currentPageState);

  const calculateGalleryScrollY = () => {
    const gallerySection = document.querySelector('[data-section="gallery"]') || null;
    const gallerySectionY = gallerySection?.getBoundingClientRect().top;

    gallerySectionScrollYRef.current = gallerySectionY || 0;
  };

  const updateScrollValues = () => {
    const viewportHeight = document.documentElement.clientHeight;
    const documentHeight = document.documentElement.scrollHeight;

    scrollRef.current = window.scrollY;

    scrollRatioRef.current = THREE.MathUtils.clamp(scrollRef.current / (viewportHeight * 1), 0, 1);

    //ページの上部から抜けたか監視
    setIndicatorOfScrollStart(scrollRatioRef.current >= 1);

    //galleryセクションに到達したか監視
    setIndicatorIsGallerySection(scrollRef.current >= gallerySectionScrollYRef.current);

    //ページの下部に到達したか監視
    setIndicatorOfScrollEnd(
      scrollRef.current >= documentHeight - viewportHeight - viewportHeight * 0.5
    );
  };

  useEffect(() => {
    calculateGalleryScrollY();
    updateScrollValues();
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      updateScrollValues();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        position: scrollRef,
        ratio: scrollRatioRef,
        indicatorOfScrollStart: indicatorOfScrollStart,
        indicatorOfScrollEnd: indicatorOfScrollEnd,
        indicatorIsGallerySection: indicatorIsGallerySection,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);
