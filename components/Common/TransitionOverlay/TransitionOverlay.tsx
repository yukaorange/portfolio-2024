import React, { useEffect, useCallback } from 'react';
import { useRecoilValue } from 'recoil';

// import { useTransitionProgress } from '@/app/TransitionContextProvider';
import { arrivalPageState } from '@/store/pageTitleAtom';

import styles from './overlay.module.scss';
import './global.scss';

export const TransitionOverlay = () => {
  // const { increaseTransition, decreaseTransition, isMounting, isUnmounting, isTransitioning } =
  //   useTransitionProgress();

  const arrivalPage = useRecoilValue(arrivalPageState);

  const renderSpannedTitle = useCallback((characters: string) => {
    return characters.split('').map((char, index) => (
      <span key={index} className={`${styles.overlay__char} transition-overlay__char`}>
        {char}
      </span>
    ));
  }, []);

  useEffect(() => {}, [arrivalPage]);

  return (
    <div className={`${styles.overlay} transition-overlay`}>
      <div className={`${styles.overlay__inner} transition-overlay__inner`}>
        <div className={`${styles.overlay__label} transition-overlay__label _en`}>
          <span className={`${styles.overlay__title} transition-overlay__title`}>
            {renderSpannedTitle(arrivalPage.title)}
          </span>
        </div>
      </div>
      <div className={`${styles.overlay__bg} transition-overlay__bg`}></div>
    </div>
  );
};
