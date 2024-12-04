'use client';

import GSAP from 'gsap';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Lottie from 'react-lottie-player';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import lottieJson from '@/public/json/data.json';
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
  const { modelProgress, modelTotal, texturesProgress, texturesTotal } =
    useRecoilValue(loadProgressAtom);

  //ui表示用の進捗
  const progressRef = useRef<number>(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const loadingDisplayRef = useRef<HTMLDivElement>(null);
  const hundredsRef = useRef<HTMLDivElement>(null);
  const tensRef = useRef<HTMLDivElement>(null);
  const onesRef = useRef<HTMLDivElement>(null);

  const updateCounter = useCallback(
    (progress: number) => {
      console.log(progress);

      const hundreds = Math.floor((progress / 100) % 100);
      const tens = Math.floor((progress / 10) % 10);
      const ones = Math.floor(progress % 10);

      if (hundredsRef.current) {
        hundredsRef.current.style.setProperty('--progress', hundreds.toString());
      }
      if (tensRef.current) {
        tensRef.current.style.setProperty('--progress', tens.toString());
      }
      if (onesRef.current) {
        onesRef.current.style.setProperty('--progress', ones.toString());
      }
    },
    [hundredsRef, tensRef, onesRef]
  );

  useEffect(() => {
    if (modelLoaded && initialLoading && animationComplete) {
      const Timeline = GSAP.timeline({
        onStart: () => {
          const fv = document.querySelector('.fv__maincopy__textbox') ?? null; //queryselectorは検索にヒットしなければnullを返すが、ここでは可読性のために明示的にnullを返すようにしています。

          fv?.classList.add('is_animating');
        },
        onComplete: () => {
          // setShouldRender(false);
          initializedCompleted(true);
          // console.log('load end');
        },
      });

      Timeline.to('[data-ui="loading"]', {
        duration: 1.4,
        autoAlpha: 1,
      });
      Timeline.to(
        '[data-ui="loading-overlay"]',
        {
          duration: 1.4,
          autoAlpha: 1,
        },
        '<'
      );
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
      ease: 'power2.inOut',
      onUpdate: () => {
        if (loadingDisplayRef.current) {
          const currentProgress = Math.round(progressRef.current);

          loadingDisplayRef.current.textContent = currentProgress.toString();

          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${currentProgress}%`;
          }

          updateCounter(currentProgress);
        }
      },
      onComplete: () => {
        if (actualProgress >= 1) {
          setAnimationComplete(true);
        }
      },
    });
  }, [modelProgress, modelTotal, texturesProgress, texturesTotal, updateCounter]);

  if (!shouldRender) return;

  return (
    <>
      <div data-ui="loading" className={styles.loading}>
        <div className={styles.loading__inner}>
          <div className={`${styles.display} _en`}>
            <span ref={loadingDisplayRef}>0</span>
            <span>%</span>
          </div>
          <div className={styles.progress}>
            <div ref={progressBarRef} className={styles.progress__bar}></div>
          </div>
          <div className={`${styles.counter} _en`}>
            <div className={styles.counter__wrap}>
              <div className={styles.counter__digit} data-ui="counter-hundreds">
                <div ref={hundredsRef} className={styles.counter__roll}>
                  {[...Array(10)].map((_, i) => (
                    <span key={i} className={styles.counter__num}>
                      {i}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.counter__digit} data-ui="counter-tens">
                <div ref={tensRef} className={styles.counter__roll}>
                  {[...Array(10)].map((_, i) => (
                    <span key={i} className={styles.counter__num}>
                      {i}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.counter__digit} data-ui="counter-ones">
                <div ref={onesRef} className={styles.counter__roll}>
                  {[...Array(10)].map((_, i) => (
                    <span key={i} className={styles.counter__num}>
                      {i}
                    </span>
                  ))}
                </div>
              </div>
              <span className={styles.counter__percent}>%</span>
            </div>
          </div>
          <div className={styles.lottie}>
            <div className={styles.lottie__icon}>
              <Lottie loop play animationData={lottieJson} />
            </div>
          </div>
        </div>
      </div>
      <div data-ui="loading-overlay" className={styles.overlay}></div>
    </>
  );
};

Loading.displayName = 'Loading';
