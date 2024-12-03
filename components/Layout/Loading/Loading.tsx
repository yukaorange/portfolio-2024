'use client';

import GSAP from 'gsap';
import { useEffect, useState, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { intializedCompletedAtom } from '@/store/initializedAtom';
import { loadProgressAtom } from '@/store/loadProgressAtom';
import { modelLoadedAtom, initialLoadingAtom } from '@/store/textureAtom';

import styles from './loading.module.scss';

export const Loading = () => {
  const [shouldRender, setShouldRender] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  //------------完了通知------------
  const modelLoaded = useRecoilValue(modelLoadedAtom);
  const initialLoading = useRecoilValue(initialLoadingAtom);
  const initializedCompleted = useSetRecoilState(intializedCompletedAtom);

  //---------進捗管理---------
  const progressRef = useRef<number>(0);

  const loadingDisplayRef = useRef<HTMLDivElement>(null);

  const { modelProgress, modelTotal, texturesProgress, texturesTotal } =
    useRecoilValue(loadProgressAtom);

  useEffect(() => {
    if (modelLoaded && initialLoading && animationComplete) {
      const Timeline = GSAP.timeline();

      Timeline.to('[data-ui="loading"]', {
        duration: 0.4,
        autoAlpha: 0,
        onStart: () => {
          const fv = document.querySelector('.fv__maincopy__textbox') ?? null;

          fv?.classList.add('is_animating');
        },
        onComplete: () => {
          setShouldRender(false);
          initializedCompleted(true);
          // console.log('load end');
        },
      });
    }
  }, [modelLoaded, initialLoading, animationComplete, initializedCompleted]);

  useEffect(() => {
    //モデルとテクスチャの読み込み進捗を計算
    const actualProgress = (modelProgress + texturesProgress) / (modelTotal + texturesTotal);

    //アニメーション用のダミー進捗
    const targetProgress = actualProgress >= 1 ? 100 : Math.min(actualProgress * 50, 50);

    GSAP.to(progressRef, {
      duration: actualProgress >= 1 ? 2 : 0.5,
      current: targetProgress,
      ease: 'power2.out',
      onUpdate: () => {
        if (loadingDisplayRef.current) {
          loadingDisplayRef.current.textContent = Math.round(progressRef.current).toString();
        }
      },
      onComplete: () => {
        if (actualProgress >= 1) {
          setAnimationComplete(true);
        }
      },
    });
  }, [modelProgress, modelTotal, texturesProgress, texturesTotal]);

  if (!shouldRender) return;

  return (
    <>
      <div data-ui="loading" className={styles.loading}>
        <span ref={loadingDisplayRef}>0</span>
        <span>%</span>
      </div>
      <div className={styles.overlay}></div>
    </>
  );
};

Loading.displayName = 'Loading';
