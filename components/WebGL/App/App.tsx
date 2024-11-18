import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from '@/components/WebGL/Experience/Experience';
import { useScene } from '@/store/textureAtom';

const TextureLoader = () => {
  useScene();
  return null;
};

export const App = () => {
  return (
    <Canvas gl={{ antialias: true, alpha: false }} shadows>
      <Suspense fallback={null}>
        <TextureLoader />
        <Experience />
      </Suspense>
    </Canvas>
  );
};
