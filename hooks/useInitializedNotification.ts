'use client';

import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { intializedCompletedAtom } from '@/store/initializedAtom';

export const useInitializedNortification = () => {
  const initializedCompleted = useRecoilValue(intializedCompletedAtom);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (initializedCompleted) {
      setTimeout(() => {
        document.documentElement.classList.add('is_loaded');
      }, 6000); //アニメーションが終わるまでの十分な猶予を設ける
    }
  }, [initializedCompleted]);
};
