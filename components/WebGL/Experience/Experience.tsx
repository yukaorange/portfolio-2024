'use client';

import { useFrame, useThree } from '@react-three/fiber';
// import { useControls, folder } from 'leva';
import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import * as THREE from 'three';
import { SMAAPass, ShaderPass } from 'three/examples/jsm/Addons.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import { postProcessShader } from '@/components/WebGL/Experience/postProcessShader';
import { Floor } from '@/components/WebGL/Floor/Floor';
import { Lights } from '@/components/WebGL/Lights/Lights';
import { Model } from '@/components/WebGL/Model/Model';
import { Panels } from '@/components/WebGL/Panels/Panels';
import { useFrameRate } from '@/hooks/useFrameRate';
import { useTransitionAnimation } from '@/hooks/useTransitionAnimation';
import { fps } from '@/store/fpsAtom';
import { intializedCompletedAtom } from '@/store/initializedAtom';
import { useScene } from '@/store/textureAtom';
import { deviceState } from '@/store/userAgentAtom';

import { ResponsiveCamera } from './ResponsiveCamera';
//current page が変更されるたびにテクスチャを再生成するロジックはtetureAtom.tsにある

export const Experience = () => {
  const { gl, scene, camera } = useThree();

  const lastWidthRef = useRef<number>(window.innerWidth);
  const lastTimeRef = useRef<number>(0);

  //ローディング完了を検知して動くアニメーションの制御
  const loadingTransitionRef = useTransitionAnimation({
    trigger: intializedCompletedAtom,
    duration: 3,
    easing: 'easeInOutExpo',
  });

  //ポストプロセス
  const [composer, setComposer] = useState<EffectComposer | null>(null);
  const customPassRef = useRef<ShaderPass | null>(null);

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

    const coefficientResolution = 1.0; //解像度が必要なエフェクトに対して送信する解像度が高すぎると負荷がかかるため、解像度を下げる係数

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
    customPassRef.current = customPass;

    //出力
    //アンチエイリアス
    const smaaPass = new SMAAPass(window.innerWidth * 0.25, window.innerHeight * 0.25); //低負荷SMAA

    effectComposer.addPass(renderPass);
    effectComposer.addPass(customPass);
    effectComposer.addPass(smaaPass);

    setComposer(effectComposer);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (lastWidthRef.current === width) return; //モバイルの場合、アドレスバーの開閉で頻繁にcoordが変更される。画面幅が変わってないくせにリサイズされるのを防ぐ（半ギレ）

      gl.setSize(width, height);

      effectComposer.setSize(width, height);

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
  }, [gl, scene, camera, device]);

  // render
  useFrame(
    //フレームレート制限ロジック
    createFrameCallback((state, delta) => {
      if (!composer) return;

      //時間経過を記録する変数:delta timeを作成。
      const currentTime = state.clock.getElapsedTime();

      // const deltaTime = currentTime - lastTimeRef.current;

      lastTimeRef.current = currentTime;

      if (customPassRef.current) {
        customPassRef.current.uniforms.uTime.value = currentTime;

        customPassRef.current.uniforms.uLoadingTransition.value = loadingTransitionRef.current;
      }

      // console.log(
      //   'check status : ',
      //   '\n',
      //   'currentTime : ',
      //   currentTime,
      //   '\n',
      //   'deltaTime : ',
      //   deltaTime,
      //   '\n',
      //   'loadingTransitionRef :',
      //   loadingTransitionRef.current
      // );

      composer.render(delta);
    }),
    2
  );

  return (
    <>
      <ResponsiveCamera position={position} lookAt={lookAt} near={near} far={far} />
      <ambientLight intensity={device == 'mobile' ? 0.5 : 0.15} />
      <Lights device={device} />
      <Model
        textures={modelTextureMap}
        position={[modelPosition.x, modelPosition.y, modelPosition.z]}
        rotation={[modelRotation.x, modelRotation.y, modelRotation.z]}
      />
      <Panels
        loadedTextures={loadedTextures}
        noiseTexture={noiseTexture}
        telopTexture={telopTexture}
      />
      <Floor textures={floorTextureMap} />
    </>
  );
};
