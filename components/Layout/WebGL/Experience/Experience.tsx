import { Canvas } from '@react-three/fiber';
import React from 'react';
import { Model } from '@/components/Layout/WebGL/Model/Model';
import { ResponsiveCamera } from './ResponsiveCamera';
import { OrbitControls } from '@react-three/drei';

export const Experience = () => {
  return (
    <Canvas gl={{ antialias: true, alpha: false }} shadows>
      <ResponsiveCamera />
      <OrbitControls/>
      <ambientLight intensity={5} />
      <Model />
    </Canvas>
  );
};
