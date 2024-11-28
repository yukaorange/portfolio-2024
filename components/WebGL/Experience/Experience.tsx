'use client';

import { useFrame, useThree } from '@react-three/fiber';
// import { useControls, folder } from 'leva';
import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { OutputPass, ShaderPass } from 'three/examples/jsm/Addons.js';
import { postProcessShader } from '@/components/WebGL/Experience/postProcessShader';
import { SMAAPass } from 'three/examples/jsm/Addons.js';
import { useScrollVelocity } from '@/app/ScrollVelocityProvider';
import { useTransitionProgress } from '@/app/TransitionContextProvider';
import { Floor } from '@/components/WebGL/Floor/Floor';
import { Lights } from '@/components/WebGL/Lights/Lights';
import { Model } from '@/components/WebGL/Model/Model';
import { Panels } from '@/components/WebGL/Panels/Panels';
import { useFrameRate } from '@/hooks/useFrameRate';
import { useTransitionAnimation } from '@/hooks/useTransitionAnimation';
import { fps } from '@/store/fpsAtom';
// import { currentPageState } from '@/store/pageTitleAtom';
import { useScene } from '@/store/textureAtom';
import { deviceState } from '@/store/userAgentAtom';
import { AnimationControls } from '@/types/animation';

import { ResponsiveCamera } from './ResponsiveCamera';
//current page が変更されるたびにテクスチャを再生成するロジックはtetureAtom.tsにある

export const Experience = () => {
  const { gl, scene, camera } = useThree();
  const { velocityRef, currentProgressRef, targetProgressRef } = useScrollVelocity();
  const {
    // decreaseProgress,
    //  increaseProgress,
    singleProgress,
    isTransitioning,
  } = useTransitionProgress();
  const observePageTransitionRef = useTransitionAnimation();
  const lastTimeRef = useRef<number>(0);
  const [composer, setComposer] = useState<EffectComposer | null>(null);
  // const currentPage = useRecoilValue(currentPageState);

  //フレームレート制限ロジック導入
  const device = useRecoilValue(deviceState);
  const frameRate = useRecoilValue(fps);
  const { createFrameCallback } = useFrameRate({ fps: frameRate });

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

  //LEVAコントロールパネル
  // const controls = useControls({
  //   position: { x: 0, y: 1.0, z: 10 },
  //   lookAt: { x: 0, y: 3.0, z: 0 },
  //   near: 0.1,
  //   far: 1000,
  //   modelPosition: { x: 0, y: 0, z: 11 },
  //   modelRotation: { x: 0, y: 0, z: 0 },
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

    const coefficientResolution = 0.5; //解像度が必要なエフェクトに対して送信する解像度が高すぎると負荷がかかるため、解像度を下げる係数

    //シーンをレンダリングするだけのパス
    const renderPass = new RenderPass(scene, camera);

    //自作のエフェクト
    const customPass = new ShaderPass(
      postProcessShader(
        window.innerWidth * coefficientResolution,
        window.innerHeight * coefficientResolution,
        device
      )
    );

    //出力
    //アンチエイリアス
    const smaaPass = new SMAAPass(window.innerWidth * 0.25, window.innerHeight * 0.25); //低負荷SMAA

    effectComposer.addPass(renderPass);
    effectComposer.addPass(customPass);
    effectComposer.addPass(smaaPass);

    setComposer(effectComposer);

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);

      customPass.uniforms.uAspect.value = window.innerWidth / window.innerHeight;

      customPass.uniforms.uResolution.value = new THREE.Vector2(
        window.innerWidth * coefficientResolution,
        window.innerHeight * coefficientResolution
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [gl, scene, camera]);

  // render
  useFrame(
    //フレームレート制限ロジック
    createFrameCallback((state, delta) => {
      if (!composer) return;

      //時間経過を記録する変数:delta timeを作成。
      const currentTime = state.clock.getElapsedTime();

      // const deltaTime = currentTime - lastTimeRef.current;

      lastTimeRef.current = currentTime;

      // console.log(deltaTime);

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
    }),
    2
  );

  const animationControls: AnimationControls = {
    // increaseProgress,
    // decreaseProgress,
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
