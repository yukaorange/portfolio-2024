import { RootState } from '@react-three/fiber';
import { useRef } from 'react';

interface UseFrameRateProps {
  fps?: number;
}

type FrameCallback = (state: RootState, delta: number) => void;

export const useFrameRate = ({ fps = 45 }: UseFrameRateProps) => {
  const lastFrameTimeRef = useRef<number>(0);

  const frameInterval = 1 / fps;

  const createFrameCallback = (callback: FrameCallback): FrameCallback => {
    const frameRateControlledCallback = (state: RootState, delta: number) => {
      const currentTime = state.clock.getElapsedTime();

      const elapsed = currentTime - lastFrameTimeRef.current;

      if (elapsed < frameInterval) {
        return;
      }

      lastFrameTimeRef.current = currentTime - (elapsed % frameInterval);
      callback(state, delta);
    };

    return frameRateControlledCallback;
  };

  return { createFrameCallback };
};
