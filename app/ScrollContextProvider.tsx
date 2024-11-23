import React, { createContext, useContext, useRef, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import * as THREE from 'three';

import { currentPageState } from '@/store/pageTitleAtom';

const ScrollContext = createContext({
  position: { current: 0 },
  ratio: { current: 0 },
  indicatorOfScrollStart: { current: false },
  indicatorOfScrollEnd: { current: false },
  // indicatorIsGallerySection: { current: false },
}); //refオブジェクトを渡すので、{ current: 0 }はRefオブジェクトのこと。使用するときは、 const { position: scroll, ratio: scrollRatio } = useScroll();として取り出して、scroll.currentのように使う。

interface ScrollProviderProps {
  children: React.ReactNode;
}

export const ScrollProvider = ({ children }: ScrollProviderProps) => {
  const scrollRef = useRef<number>(0);
  const scrollRatioRef = useRef<number>(0);
  const indicatorOfScrollStartRef = useRef<boolean>(false);
  const indicatorOfScrollEndRef = useRef<boolean>(false);
  // const gallerSectionScrollYRef = useRef<number>(0);
  // const indicatorIsGallerySectioneRef = useRef<boolean>(false);
  // const currentPage = useRecoilValue(currentPageState);

  // const calculateGalleryScrollY = () => {
  //   const gallerySection = document.querySelector('[data-section="gallery"]') || null;
  //   const gallerySectionY = gallerySection?.getBoundingClientRect().top;

  //   gallerSectionScrollYRef.current = gallerySectionY || 0;
  // };

  const updateScrollValues = () => {
    scrollRef.current = window.scrollY;

    scrollRatioRef.current = THREE.MathUtils.clamp(
      scrollRef.current / (window.innerHeight * 1),
      0,
      1
    );
    //ページの上部から抜けたか監視
    indicatorOfScrollStartRef.current = scrollRatioRef.current >= 1;
    //galleryセクションに到達したか監視
    // indicatorIsGallerySectioneRef.current = scrollRef.current >= gallerSectionScrollYRef.current;
    //ページの下部に到達したか監視
    indicatorOfScrollEndRef.current =
      scrollRef.current >=
      document.documentElement.scrollHeight - window.innerHeight - window.innerHeight * 0.5;
  };

  useEffect(() => {
    // calculateGalleryScrollY();
    updateScrollValues();
  }, [currentPageState]);

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
        indicatorOfScrollStart: indicatorOfScrollStartRef,
        indicatorOfScrollEnd: indicatorOfScrollEndRef,
        // indicatorIsGallerySection: indicatorIsGallerySectioneRef,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);
