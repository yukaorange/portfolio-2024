'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useControls, folder } from 'leva';
import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';

import { useScrollVelocity } from '@/app/ScrollVelocityProvider';
import { useTransitionProgress } from '@/app/TransitionContextProvider';
import { Floor } from '@/components/WebGL/Floor/Floor';
import { Lights } from '@/components/WebGL/Lights/Lights';
import { Model } from '@/components/WebGL/Model/Model';
import { Panels } from '@/components/WebGL/Panels/Panels';
import { useTransitionAnimation } from '@/hooks/useTransitionAnimation';
// import { currentPageState } from '@/store/pageTitleAtom';
import { useScene } from '@/store/textureAtom';
import { deviceState } from '@/store/userAgentAtom';
import { AnimationControls } from '@/types/animation';

import { ResponsiveCamera } from './ResponsiveCamera';
//current page が変更されるたびにテクスチャを再生成するロジックはtetureAtom.tsにある

export const Experience = () => {
  const { velocityRef, currentProgressRef, targetProgressRef } = useScrollVelocity();
  const { decreaseProgress, increaseProgress, singleProgress, isTransitioning } =
    useTransitionProgress();
  const { gl, scene, camera } = useThree();
  const observePageTransitionRef = useTransitionAnimation();
  const lastTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const [composer, setComposer] = useState<EffectComposer | null>(null);
  // const currentPage = useRecoilValue(currentPageState);
  const device = useRecoilValue(deviceState);
  const FPS = 45;
  const frameInterval = 1 / FPS;

  const {
    loadedTextures,
    characterTexture,
    suitcaseTexture,
    floorNormalTexture,
    floorRoughnessTexture,
    noiseTexture,
    telopTexture,
  } = useScene();

  const modelTextureMap = {
    characterTexture: characterTexture || new THREE.Texture(),
    suitcaseTexture: suitcaseTexture || new THREE.Texture(),
    noiseTexture: noiseTexture || new THREE.Texture(),
  };

  const floorTextureMap = {
    roughness: floorRoughnessTexture || new THREE.Texture(),
    normal: floorNormalTexture || new THREE.Texture(),
    noiseTexture: noiseTexture || new THREE.Texture(),
  };

  // メッシュやカメラの位置;
  // LEVA, 確定後は固定値をつかう;
  // const {
  //   position,
  //   lookAt,
  //   near,
  //   far,
  //   modelPosition,
  //   modelRotation,
  //   color,
  //   // pointLight1,
  //   // pointLight2,
  //   // pointLight3,
  // } = useControls({
  //   Camera: folder({
  //     position: {
  //       value: { x: 0, y: 1.0, z: 10 }, //[0.0,1.0,5.0] is default
  //       step: 0.01,
  //     },
  //     lookAt: {
  //       value: { x: 0, y: 3.0, z: 0 }, //[0,3.0,0] is default
  //       step: 0.1,
  //     },
  //     near: { value: 0.1, min: 0.1, max: 10, step: 0.1 },
  //     far: { value: 1000, min: 100, max: 5000, step: 100 },
  //   }),
  //   Model: folder({
  //     modelPosition: {
  //       value: { x: 0, y: 0, z: 10 },
  //       step: 0.1,
  //     },
  //     modelRotation: {
  //       value: { x: 0, y: 0, z: 0 },
  //       step: 0.1,
  //     },
  //   }),
  //   Floor: folder({
  //     color: { value: [0.1, 0.1, 0.1], label: 'Ground Color' },
  //   }),
  // });

  //LEVAで決めた値、確定後はこっちに入れる
  const controls = {
    position: { x: 0, y: 1.0, z: 10 },
    lookAt: { x: 0, y: 3.0, z: 0 },
    near: 0.1,
    far: 1000,
    modelPosition: { x: 0, y: 0, z: 11 },
    modelRotation: { x: 0, y: 0, z: 0 },
  };

  const { position, lookAt, near, far, modelPosition, modelRotation } = controls;

  // post processing
  useEffect(() => {
    const effectComposer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);

    effectComposer.addPass(renderPass);
    effectComposer.addPass(smaaPass);

    setComposer(effectComposer);
  }, [gl, scene, camera]);

  // render
  useFrame((state, delta) => {
    //フレームレート制限ロジック
    const currentTime = state.clock.getElapsedTime();

    const elapsed = currentTime - lastFrameTimeRef.current;

    if (elapsed < frameInterval) return;

    lastFrameTimeRef.current = currentTime - (elapsed % frameInterval);

    if (!composer) return;

    //時間経過を記録

    const deltaTime = currentTime - lastTimeRef.current;

    lastTimeRef.current = currentTime;

    // console.log(
    //   'check status : ',
    //   '\n',
    //   // 'delta time',
    //   // deltaTime,
    //   // '\n',
    //   // 'current page : ',
    //   // currentPage,
    //   // '\n',
    //   'velocity : ',
    //   velocityRef.current, //スピードメーター
    //   'increase Progress : ',
    //   increaseProgress.current, //トランジション時に0->1
    //   '\n',
    //   'decrease progress : ',
    //   decreaseProgress.current, //トランジション時に1->0
    //   '\n',
    //   'single Progress :',
    //   singleProgress.current, //トランジション時に0->1->0
    //   '\n',
    //   'obsever page change :',
    //   observePageTransitionRef.current, //ページ切り替わり検知で0->1（duration 1000ms）,その後0
    //   // '\n',
    //   // 'indicatorOfScrollStart : ',
    //   // indicatorOfScrollStart, //メインビューエリアを離れたらtrue
    //   // '\n',
    //   // 'indicatorOfScrollEnd : ',
    //   // indicatorOfScrollEnd, //フッターに到達したらtrue
    //   '\n',
    //   'gallery current progress : ',
    //   currentProgressRef.current, //top pageのgalleryの進行度
    //   '\n',
    //   'gallery target progress : ',
    //   targetProgressRef.current, //top pageのgalleryのインデックス(target)
    //   '\n',
    //   'gallery current : ',
    //   Math.round(currentProgressRef.current) //top pageのgalleryのインデックス
    // );

    composer.render(delta);
  }, 1);

  const animationControls: AnimationControls = {
    increaseProgress,
    decreaseProgress,
    singleProgress,
    velocityRef,
    currentProgressRef,
    targetProgressRef,
    observePageTransitionRef,
    isTransitioning,
  };

  return (
    <>
      <ResponsiveCamera position={position} lookAt={lookAt} near={near} far={far} />
      <ambientLight intensity={device == 'mobile' ? 0.5 : 0.15} />
      <Lights device={device} />
      <Model
        textures={modelTextureMap}
        animationControls={animationControls}
        position={[modelPosition.x, modelPosition.y, modelPosition.z]}
        rotation={[modelRotation.x, modelRotation.y, modelRotation.z]}
      />
      <Panels
        loadedTextures={loadedTextures}
        animationControls={animationControls}
        noiseTexture={noiseTexture}
        telopTexture={telopTexture}
      />
      <Floor textures={floorTextureMap} animationControls={animationControls} />
    </>
  );
};
