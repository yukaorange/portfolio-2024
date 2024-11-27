export type AnimationControls = {
  // increaseProgress: React.RefObject<number>;
  // decreaseProgress: React.RefObject<number>;
  singleProgress: React.RefObject<number>;
  velocityRef: React.MutableRefObject<number>;
  currentProgressRef: React.MutableRefObject<number>;
  targetProgressRef: React.MutableRefObject<number>;
  isTransitioning?: React.RefObject<boolean>;
  // indicatorOfScrollStart?: boolean;
  // indicatorOfScrollEnd?: boolean;
  // indicatorIsGallerySection?: boolean;
  observePageTransitionRef: React.MutableRefObject<number>;
};
