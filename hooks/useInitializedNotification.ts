import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { intializedCompletedAtom } from '@/store/initializedAtom';

export const useInitializedNortification = () => {
  const initializedCompleted = useRecoilValue(intializedCompletedAtom);

  useEffect(() => {
    if (initializedCompleted) {
      setTimeout(() => {
        document.documentElement.classList.add('is_loaded');
      }, 10000); //アニメーションが終わるまでの十分な猶予を設ける
    }
  }, [initializedCompleted]);
};
