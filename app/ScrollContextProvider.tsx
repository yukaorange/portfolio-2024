import React, { createContext, useContext, useRef, useEffect, useState, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import * as THREE from 'three';

import { currentPageState } from '@/store/pageTitleAtom';

const ScrollContext = createContext({
  position: { current: 0 },
  ratio: { current: 0 },
  indicatorOfScrollStart: false,
  indicatorOfScrollEnd: false,
  indicatorOfGallerySection: false,
}); //position,ratioはRefオブジェクトなので、再レンダリングを望まないコンポーネントで使用（DrumRoll等）

interface ScrollProviderProps {
  children: React.ReactNode;
}

//スクロール進捗とセクションへの侵入を監視する
export const ScrollProvider = ({ children }: ScrollProviderProps) => {
  const scrollRef = useRef<number>(0);
  const scrollRatioRef = useRef<number>(0);
  const [indicatorOfScrollStart, setIndicatorOfScrollStart] = useState<boolean>(false);
  const [indicatorOfGallerySection, setIndicatorOfGallerySection] = useState<boolean>(false);
  const [indicatorOfScrollEnd, setIndicatorOfScrollEnd] = useState<boolean>(false);
  const gallerySectionScrollYRef = useRef<number>(0);
  const currentPage = useRecoilValue(currentPageState);

  const calculateGalleryScrollY = useCallback(() => {
    const gallerySection = document.querySelector('[data-section="gallery"]') || null;

    let gallerySectionY = gallerySection?.getBoundingClientRect().top ?? 0;

    gallerySectionY += window.scrollY; //ページ遷移時に再計算されるから、その時点でのスクロール量を加算

    gallerySectionScrollYRef.current = gallerySectionY || 0;
  }, []);

  const updateScrollValues = useCallback(() => {
    const viewportHeight = document.documentElement.clientHeight;
    const documentHeight = document.documentElement.scrollHeight;

    scrollRef.current = window.scrollY;

    scrollRatioRef.current = THREE.MathUtils.clamp(scrollRef.current / (viewportHeight * 1), 0, 1);

    //ページの上部から抜けたか監視
    setIndicatorOfScrollStart(scrollRatioRef.current >= 1);

    // console.log('scroll start: ', scrollRatioRef.current >= 1);

    //galleryセクションに到達したか監視
    setIndicatorOfGallerySection(scrollRef.current >= gallerySectionScrollYRef.current);

    // console.log('gallery section :', scrollRef.current >= gallerySectionScrollYRef.current);

    // console.log('scroll positon y :', scrollRef.current);

    // console.log('gallery section y :', gallerySectionScrollYRef.current);

    //ページの下部に到達したか監視
    setIndicatorOfScrollEnd(
      scrollRef.current >= documentHeight - viewportHeight - viewportHeight * 0.5
    );
  }, []);

  useEffect(() => {
    // console.log(currentPage);

    calculateGalleryScrollY();
    updateScrollValues();
  }, [currentPage, calculateGalleryScrollY, updateScrollValues]);

  useEffect(() => {
    const handleScroll = () => {
      updateScrollValues();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollValues]);

  return (
    <ScrollContext.Provider
      value={{
        position: scrollRef,
        ratio: scrollRatioRef,
        indicatorOfScrollStart: indicatorOfScrollStart,
        indicatorOfScrollEnd: indicatorOfScrollEnd,
        indicatorOfGallerySection: indicatorOfGallerySection,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);
