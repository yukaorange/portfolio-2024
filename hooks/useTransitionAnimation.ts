import { useEffect, useRef } from 'react';
import { RecoilValue, useRecoilValue } from 'recoil';

interface UseTransitionAnimationProps<T> {
  trigger: RecoilValue<T>;
  duration: number;
}

export const useTransitionAnimation = ({
  trigger, //booleanを要求
  duration = 1,
}: UseTransitionAnimationProps<boolean>) => {
  const triggerValue = useRecoilValue(trigger);

  const animationFrameRef = useRef<number | null>(null);

  //このRefオブジェクトは値の変化を検知して変化する。
  const observePageTransitionRef = useRef<number>(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = observePageTransitionRef.current;
    const targetValue = triggerValue ? 1 : 0;

    const animate = (time: number) => {
      if (startTime === null) {
        startTime = time;
      }

      const progress = Math.min((time - startTime) / (duration * 1000), 1);

      // 0 -> 1 or 1 -> 0
      observePageTransitionRef.current = startValue + (targetValue - startValue) * progress;

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [triggerValue, duration]);

  return observePageTransitionRef;
};
