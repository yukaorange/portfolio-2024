import { useEffect, useRef } from 'react';

import { useTransitionProgress } from '@/app/TransitionContextProvider';

// const easingFunctions = {
//   linear: (t: number): number => t,
//   easeInQuad: (t: number): number => t * t,
//   easeOutQuad: (t: number): number => t * (2 - t),
//   easeInOutQuad: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
//   easeInCubic: (t: number): number => t * t * t,
//   easeOutCubic: (t: number): number => --t * t * t + 1,
//   easeInOutCubic: (t: number): number =>
//     t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
//   easeInQuart: (t: number): number => t * t * t * t,
//   easeOutQuart: (t: number): number => 1 - --t * t * t * t,
//   easeInOutQuart: (t: number): number => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
// };

export const Filters = () => {
  const {
    // decreaseProgress,
    //  increaseProgress,
    isUnmounting,
    isMounting,
    singleProgress,
  } = useTransitionProgress();

  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const lastUpdateTimeRef = useRef(0);

  // const ease = (t: number): number => {
  //   return t * (2 - t);
  // };

  useEffect(() => {
    const updateNoiseEffect = (currentTime: number) => {
      // if (!turbRef.current || !increaseProgress.current) return;
      if (!turbRef.current || !singleProgress.current) return;

      if (currentTime - lastUpdateTimeRef.current < 1000 / 10) {
        return;
      }

      lastUpdateTimeRef.current = currentTime;

      // const rawIncreaseProgress = increaseProgress.current; //0->1
      // const rawDecreaseProgress = decreaseProgress.current; //1->0

      const rawSingleProgress = singleProgress.current;

      // const easedIncreaseProgress = ease(rawIncreaseProgress as number);
      // const easedDecreaseProgress = ease(rawDecreaseProgress as number);

      // const increasingProgress = easedIncreaseProgress;
      // const decreasingProgress = easedDecreaseProgress;

      let baseFrequency = 0;

      // if (isUnmounting.current == true) {
      //   baseFrequency = 0.000001 + (0.99 - 0.000001) * increasingProgress;
      // } else if (isMounting.current == true) {
      //   baseFrequency = 0.000001 + (0.99 - 0.000001) * decreasingProgress;
      // }
      if (rawSingleProgress) {
        baseFrequency = 0.000001 + (0.99 - 0.000001) * rawSingleProgress;
      }

      // console.log(
      //   'isUnmounting : ',
      //   isUnmounting.current,
      //   '\n',
      //   'isMounting :',
      //   isMounting.current,
      //   '\n',
      //   'increasingProgress :',
      //   increasingProgress,
      //   '\n',
      //   'decreasingProgress :',
      //   decreasingProgress,
      //   '\n',
      //   'baseFrequency :',
      //   baseFrequency,
      //   '\n'
      // );

      turbRef.current.setAttribute('baseFrequency', `0 ${baseFrequency}`);
    };

    let animationFrameId: number;

    const animate = (currentTime: number) => {
      updateNoiseEffect(currentTime);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    // increaseProgress,
    // decreaseProgress,
    singleProgress,
    isUnmounting,
    isMounting,
  ]);

  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {/* Chromatic Aberration Filter */}
        {/* <filter id="Chromatic_aberration">
          <feOffset in="SourceGraphic" result="slide-red" dx="-3" dy="0"></feOffset>
          <feOffset in="SourceGraphic" result="yellow" dx="3" dy="0"></feOffset>
          <feOffset in="SourceGraphic" result="slide-blue" dx="4" dy="0"></feOffset>
          <feColorMatrix
            in="slide-red"
            type="matrix"
            result="red"
            values="0 0 0 0 0.89 0 0 0 0 0.9 0 0 0 0 0.1 0 0 0 1 0"
            //| R' |   | X 0 0 0 1 |   | R |
            //| G' | = | 0 X 0 0 0 | * | G |
            //| B' |   | 0 0 X 0 0 | * | B |
            //| A' |   | 0 0 0 1 0 |   | A |
          ></feColorMatrix>
          <feColorMatrix
            in="slide-blue"
            type="matrix"
            result="blue"
            values="0 0 0 0 0.38 0 0 0 0 0.04 0 0 0 0 0.99 0 0 0 1 0"
            //| R' |   | X 0 0 0 0 |   | R |
            //| G' | = | 0 X 0 0 0 | * | G |
            //| B' |   | 0 0 X 0 1 | * | B |
            //| A' |   | 0 0 0 1 0 |   | A |
          ></feColorMatrix>
          <feBlend mode="lighten" in="red" in2="blue" result="main"></feBlend>
          <feBlend mode="multiply" in="main" in2="SourceGraphic" result="main1"></feBlend>
          <feComposite in="SourceGraphic" in2="main1" result="comp"></feComposite>
          <feMerge>
            <feMergeNode in="yellow"></feMergeNode>
            <feMergeNode in="comp"></feMergeNode>
          </feMerge>
        </filter> */}

        {/* Analog noise filter */}
        <filter id="Analog_noise">
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency="0.0 0.0"
            numOctaves="2"
            result="warp"
          ></feTurbulence>
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="4"
            in="SourceGraphic"
            in2="warp"
          />
        </filter>
      </defs>
    </svg>
  );
};
