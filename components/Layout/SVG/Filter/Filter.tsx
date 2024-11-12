import { useTransitionProgress } from '@/app/TransitionContextProvider';
import { useEffect, useRef } from 'react';

export const Filters = () => {
  const { decreaseProgress, increaseProgress, isUnmounting, isMounting } = useTransitionProgress();

  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const lastUpdateTimeRef = useRef(0);

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useEffect(() => {
    const updateNoiseEffect = (currentTime: number) => {
      if (!turbRef.current || !increaseProgress.current) return;

      // console.log(currentTime - lastUpdateTimeRef.current);

      if (currentTime - lastUpdateTimeRef.current < 1000 / 30) return;

      lastUpdateTimeRef.current = currentTime;

      let rawIncreaseProgress = increaseProgress.current;
      let rawDecreaseProgress = decreaseProgress.current;

      let easedIncreaseProgress = easeInOutCubic(rawIncreaseProgress as number);
      let easedDecreaseProgress = easeInOutCubic(rawDecreaseProgress as number);

      let increasingProgress = easedIncreaseProgress;
      let decreasingProgress = easedDecreaseProgress;

      let baseFrequency = 0;

      if (isUnmounting.current == true) {
        baseFrequency = 0.000001 + (0.9 - 0.000001) * increasingProgress;
      } else if (isMounting.current == true) {
        baseFrequency = 0.000001 + (0.9 - 0.000001) * decreasingProgress;
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
  }, [increaseProgress, decreaseProgress, isUnmounting, isMounting]);

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
            numOctaves="1"
            result="warp"
          ></feTurbulence>
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="10"
            in="SourceGraphic"
            in2="warp"
          />
        </filter>
      </defs>
    </svg>
  );
};
