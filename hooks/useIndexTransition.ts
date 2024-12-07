import { useEffect, useRef } from 'react';
import { RecoilValue, useRecoilValue } from 'recoil';

type EasingType = 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad';

const easingFunctions = {
  linear: (t: number): number => t,
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

interface IndexTransitionState {
  currentIndex: number;
  targetIndex: number;
}

interface UseIndexTransitionProps {
  trigger: RecoilValue<IndexTransitionState>;
  duration: number;
  easing?: EasingType;
}

export const useIndexTransition = ({
  trigger,
  duration = 1,
  easing = 'linear',
}: UseIndexTransitionProps) => {
  const transitionState = useRecoilValue(trigger);
  const animationFrameRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  const prevIndicesRef = useRef({ current: -1, target: -1 });

  useEffect(() => {
    if (
      transitionState.currentIndex !== prevIndicesRef.current.current ||
      transitionState.targetIndex !== prevIndicesRef.current.target
    ) {
      let startTime: number | null = null;

      progressRef.current = 0;

      const animate = (time: number) => {
        if (startTime === null) {
          startTime = time;
        }

        const progress = Math.min((time - startTime) / (duration * 1000), 1);

        const easedProgress = easingFunctions[easing](progress);

        progressRef.current = easedProgress;

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      prevIndicesRef.current = {
        current: transitionState.currentIndex,
        target: transitionState.targetIndex,
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [transitionState, duration, easing]);

  return progressRef;
};
