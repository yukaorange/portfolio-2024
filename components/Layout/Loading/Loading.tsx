import GSAP from 'gsap';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { intializedCompletedAtom } from '@/store/initializedAtom';
import { modelLoadedAtom, initialLoadingAtom } from '@/store/textureAtom';

import styles from './loading.module.scss';

export const Loading = () => {
  const [shouldRender, setShouldRender] = useState(true);

  const modelLoaded = useRecoilValue(modelLoadedAtom);
  const initialLoading = useRecoilValue(initialLoadingAtom);
  const initializedCompleted = useSetRecoilState(intializedCompletedAtom);

  useEffect(() => {
    if (modelLoaded && initialLoading) {
      GSAP.to('[data-ui="loading"]', {
        duration: 1,
        autoAlpha: 0,
        onComplete: () => {
          setShouldRender(false);
          initializedCompleted(true);
        },
      });
    }
  }, [modelLoaded, initialLoading, initializedCompleted]);

  if (!shouldRender) return;

  return (
    <>
      <div data-ui="loading" className={styles.loading}></div>
      <div className={styles.overlay}></div>
    </>
  );
};

Loading.displayName = 'Loading';
