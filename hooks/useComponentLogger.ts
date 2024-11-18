'use client';

import { useEffect, useRef } from 'react';

export function useComponentLogger(componentName: string) {
  const mountedRef = useRef(false);
  const effectCount = useRef(0);

  useEffect(() => {
    console.log(`Component "${componentName}" mounted`);
    mountedRef.current = true;

    return () => {
      console.log(`Component "${componentName}" unmounted`);
    };
  }, [componentName]);

  const logEffect = (effectName: string, dependencies: any[]) => {
    const effectId = effectCount.current++;

    useEffect(() => {
      if (mountedRef.current) {
        console.log(
          `Effect "${effectName}" (ID: ${effectId}) in "${componentName}" re-run with dependencies:`,
          dependencies
        );
      } else {
        console.log(`Effect "${effectName}" (ID: ${effectId}) in "${componentName}" mounted`);
      }

      return () => {
        console.log(`Effect "${effectName}" (ID: ${effectId}) in "${componentName}" cleanup`);
      };
    }, dependencies);
  };

  return logEffect;
}
