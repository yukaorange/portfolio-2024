'use client';

import { useControls, folder } from 'leva';
import React, { useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { useScene } from '@/store/textureAtom';

import { Model } from '@/components/WebGL/Model/Model';
import { ResponsiveCamera } from './ResponsiveCamera';
import { Floor } from '@/components/WebGL/Floor/Floor';
import { Panels } from '@/components/WebGL/Panels/Panels';

export const Experience = () => {
  const { gl, scene, camera } = useThree();
  const [composer, setComposer] = useState<EffectComposer | null>(null);
  const { currentPage, loadedTextures, characterTexture, suitcaseTexture } = useScene();

  const modelTextureMap = {
    characterTexture: characterTexture || new THREE.Texture(),
    suitcaseTexture: suitcaseTexture || new THREE.Texture(),
  };

  //observe  page and textures
  useEffect(() => {
    //current page が変更されるたびにテクスチャを再生成するロジックはtetureAtom.tsにある
    console.log('Current page:', currentPage);
    console.log('Loaded textures:', loadedTextures);
  }, [currentPage, loadedTextures]);

  // camera setting
  // const { position, lookAt, near, far, modelPosition, modelRotation, color } = useControls(
  //   {
  //     Camera: folder({
  //       position: {
  //         value: { x: 0, y: 2.3, z: 10 }, //[0.0,0.5,5.0] is default
  //         step: 0.01,
  //       },
  //       lookAt: {
  //         value: { x: 0, y: 2.3, z: 0 }, //[0,1.7,0] is default
  //         step: 0.1,
  //       },
  //       near: { value: 0.1, min: 0.1, max: 10, step: 0.1 },
  //       far: { value: 1000, min: 100, max: 5000, step: 100 },
  //     }),
  //     Model: folder({
  //       modelPosition: {
  //         value: { x: 0, y: 0, z: 9 },
  //         step: 0.1,
  //       },
  //       modelRotation: {
  //         value: { x: 0, y: 0, z: 0 },
  //         step: 0.1,
  //       },
  //     }),
  //     Floor: folder({
  //       color: { value: [0.2, 0.2, 0.2], label: 'Ground Color' },
  //     }),
  //   },
  //   {
  //     collapsed: true,
  //     hidden: true,
  //   }
  // );

  const controls = {
    position: { x: 0, y: 2.3, z: 10 },
    lookAt: { x: 0, y: 2.3, z: 0 },
    near: 0.1,
    far: 1000,
    modelPosition: { x: 0, y: 0, z: 9 },
    modelRotation: { x: 0, y: 0, z: 0 },
    color: [0.2, 0.2, 0.2],
  };
  const { position, lookAt, near, far, modelPosition, modelRotation, color } = controls;

  // post processing
  useEffect(() => {
    const effectComposer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);

    effectComposer.addPass(renderPass);
    effectComposer.addPass(smaaPass);

    setComposer(effectComposer);
  }, []);

  // render
  useFrame((state, delta) => {
    if (!composer) return;
    composer.render(delta);
  }, 1);

  return (
    <>
      <ResponsiveCamera position={position} lookAt={lookAt} near={near} far={far} />
      <ambientLight intensity={0.3} />
      <Model
        textures={modelTextureMap}
        position={[modelPosition.x, modelPosition.y, modelPosition.z]}
        rotation={[modelRotation.x, modelRotation.y, modelRotation.z]}
      />
      <Panels textures={loadedTextures} />
      <Floor color={color} />
    </>
  );
};
