import { useEffect, useRef } from 'react';
import { RecoilValue, useRecoilValue } from 'recoil';

/**
 *  監視するatomが
 *  false - >  true のとき、0 -> 1
 *  true -> false のとき、1 -> 0
 *  と変化する。
 */

type EasingType =
  | 'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  | 'easeInSine'
  | 'easeOutSine'
  | 'easeInOutSine'
  | 'easeInCirc'
  | 'easeOutCirc'
  | 'easeInOutCirc';

// イージング関数のコレクション
const easingFunctions = {
  // 線形 (デフォルト)
  linear: (t: number): number => t,

  // 二次関数イージング
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  // 三次関数イージング
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => --t * t * t + 1,
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // 4次関数イージング（より急激な変化）
  easeInQuart: (t: number): number => t * t * t * t,
  easeOutQuart: (t: number): number => 1 - --t * t * t * t,
  easeInOutQuart: (t: number): number => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  // 5次関数イージング（かなり急激な変化）
  easeInQuint: (t: number): number => t * t * t * t * t,
  easeOutQuint: (t: number): number => 1 - --t * t * t * t * t,
  easeInOutQuint: (t: number): number =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 - 16 * --t * t * t * t * t,

  // 指数関数イージング（最も急激な変化）
  easeInExpo: (t: number): number => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number): number =>
    t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? Math.pow(2, 20 * t - 10) / 2
          : (2 - Math.pow(2, -20 * t + 10)) / 2,

  // サイン関数による急激な変化
  easeInSine: (t: number): number => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number): number => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,

  // サーキュラーイージング（非常に急激な加速と減速）
  easeInCirc: (t: number): number => 1 - Math.sqrt(1 - t * t),
  easeOutCirc: (t: number): number => Math.sqrt(1 - --t * t),
  easeInOutCirc: (t: number): number =>
    t < 0.5 ? (1 - Math.sqrt(1 - 4 * t * t)) / 2 : (Math.sqrt(1 - 4 * --t * t) + 1) / 2,
};

interface UseTransitionAnimationProps<T> {
  trigger: RecoilValue<T>;
  duration: number;
  easing?: EasingType;
}

export const useTransitionAnimation = ({
  trigger, //booleanを要求
  duration = 1,
  easing = 'easeInOutQuad',
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

      const easedProgress = easingFunctions[easing](progress);

      // 0 -> 1 or 1 -> 0
      observePageTransitionRef.current = startValue + (targetValue - startValue) * easedProgress;

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
  }, [triggerValue, duration, easing]);

  return observePageTransitionRef;
};
