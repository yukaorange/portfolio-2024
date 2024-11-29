import React, { createContext, useContext, useRef, useEffect, useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import * as THREE from 'three';

import { currentPageState } from '@/store/pageTitleAtom';
import { isScrollStartAtom, isGallerySectionAtom, isScrollEndAtom } from '@/store/scrollAtom';

const ScrollContext = createContext({
  position: { current: 0 },
  ratio: { current: 0 },
}); //position,ratioはRefオブジェクトなので、再レンダリングを望まないコンポーネントで使用（DrumRoll等）

interface ScrollProviderProps {
  children: React.ReactNode;
}

//スクロール進捗とセクションへの侵入を監視する
export const ScrollProvider = ({ children }: ScrollProviderProps) => {
  //--------供給するのはRef。コンポーネントの再レンダリングを望まないため--------
  const scrollRef = useRef<number>(0);
  const scrollRatioRef = useRef<number>(0);
  const gallerySectionScrollYRef = useRef<number>(0);

  const prevScrollStartRef = useRef(false);
  const prevGallerySectionRef = useRef(false);
  const prevScrollEndRef = useRef(false);

  const currentPage = useRecoilValue(currentPageState);

  //----------Recoilの状態を更新するための関数を取得----------
  const setIsScrollStart = useSetRecoilState(isScrollStartAtom);
  const setIsGallerySection = useSetRecoilState(isGallerySectionAtom);
  const setIsScrollEnd = useSetRecoilState(isScrollEndAtom);

  //----------ギャラリーセクションのY座標を計算----------
  const calculateGalleryScrollY = useCallback(() => {
    const gallerySection = document.querySelector('[data-section="gallery"]') || null;

    let gallerySectionY = gallerySection?.getBoundingClientRect().top ?? 0;

    gallerySectionY += window.scrollY; //ページ遷移時に再計算されるから、その時点でのスクロール量を加算

    gallerySectionScrollYRef.current = gallerySectionY || 0;
  }, []);

  //----------スクロール連動のメソッドはコチラ ----------
  const updateScrollValues = useCallback(() => {
    const viewportHeight = document.documentElement.clientHeight;
    const documentHeight = document.documentElement.scrollHeight;

    scrollRef.current = window.scrollY;

    scrollRatioRef.current = THREE.MathUtils.clamp(scrollRef.current / (viewportHeight * 1), 0, 1);

    const isScrollStartCurrent = scrollRatioRef.current >= 1;
    if (isScrollStartCurrent !== prevScrollStartRef.current) {
      setIsScrollStart(isScrollStartCurrent);
      prevScrollStartRef.current = isScrollStartCurrent;
    }

    const isGallerySectionCurrent = scrollRef.current >= gallerySectionScrollYRef.current;
    if (isGallerySectionCurrent !== prevGallerySectionRef.current) {
      setIsGallerySection(isGallerySectionCurrent);
      prevGallerySectionRef.current = isGallerySectionCurrent;
    }

    const isScrollEndCurrent =
      scrollRef.current >= documentHeight - viewportHeight - viewportHeight * 0.5;
    if (isScrollEndCurrent !== prevScrollEndRef.current) {
      setIsScrollEnd(isScrollEndCurrent);
      prevScrollEndRef.current = isScrollEndCurrent;
    }

    // console.log('scroll start: ', scrollRatioRef.current >= 1);

    // console.log('gallery section :', scrollRef.current >= gallerySectionScrollYRef.current);

    // console.log('scroll positon y :', scrollRef.current);

    // console.log('gallery section y :', gallerySectionScrollYRef.current);
  }, [setIsScrollStart, setIsGallerySection, setIsScrollEnd]);

  //----------主にページ遷移時にリセットするため---------
  useEffect(() => {
    // console.log(currentPage);

    calculateGalleryScrollY();
    updateScrollValues();
  }, [currentPage, calculateGalleryScrollY, updateScrollValues]);

  //----------リスナへの登録----------
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
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);
