export type AnimationControls = {
  increaseProgress: React.RefObject<number>;
  decreaseProgress: React.RefObject<number>;
  singleProgress: React.RefObject<number>;
  velocityRef: React.MutableRefObject<number>;
  currentProgressRef: React.MutableRefObject<number>;
  targetProgressRef: React.MutableRefObject<number>;
  indicatorOfScrollStart: React.MutableRefObject<boolean>;
  indicatorOfScrollEnd: React.MutableRefObject<boolean>;
  observePageTransitionRef: React.MutableRefObject<number>;
};
