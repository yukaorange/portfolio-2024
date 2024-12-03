import { Canvas } from '@react-three/fiber';
import React, {
  memo,
  Suspense,
  //  useEffect
} from 'react';

import { Experience } from '@/components/WebGL/Experience/Experience';
import { useScene } from '@/store/textureAtom';

const TextureLoader = memo(() => {
  useScene();
  return null;

  //-------デバッグ用-------

  // useEffect(() => {
  //   console.log('TextureLoader mounted', performance.now());
  //   return () => {
  //     console.log('TextureLoader unmounted', performance.now());
  //   };
  // }, []);

  // const {
  //   currentPage,
  //   currentTextures,
  //   loadedTextures,
  //   characterTexture,
  //   suitcaseTexture,
  //   floorNormalTexture,
  //   floorRoughnessTexture,
  //   noiseTexture,
  //   telopTexture,
  // } = useScene();

  // useEffect(() => {
  //   console.log('currentPage changed:', currentPage, performance.now());
  // }, [currentPage]);

  // useEffect(() => {
  //   console.log('currentTextures changed:', currentTextures.length, performance.now());
  // }, [currentTextures]);

  // useEffect(() => {
  //   console.log('loadedTextures changed:', loadedTextures.length, performance.now());
  // }, [loadedTextures]);

  // useEffect(() => {
  //   console.log('characterTexture changed:', characterTexture, performance.now());
  // }, [characterTexture]);

  // useEffect(() => {
  //   console.log('suitcaseTexture changed:', suitcaseTexture, performance.now());
  // }, [suitcaseTexture]);

  // useEffect(() => {
  //   console.log('floorNormalTexture changed:', floorNormalTexture, performance.now());
  // }, [floorNormalTexture]);

  // useEffect(() => {
  //   console.log('floorRoughnessTexture changed:', floorRoughnessTexture, performance.now());
  // }, [floorRoughnessTexture]);

  // useEffect(() => {
  //   console.log('noiseTexture changed:', noiseTexture, performance.now());
  // }, [noiseTexture]);

  // useEffect(() => {
  //   console.log('telopTexture changed:', telopTexture, performance.now());
  // }, [telopTexture]);

  // return null;

  //-------デバック用ここまで-------
});
TextureLoader.displayName = 'TextureLoader';

export const App = () => {
  return (
    <Canvas gl={{ antialias: true, alpha: false }}>
      <Suspense fallback={null}>
        <TextureLoader />
        <Experience />
      </Suspense>
    </Canvas>
  );
};
