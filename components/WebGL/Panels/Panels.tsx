import { Instance, Instances } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import * as THREE from 'three';

import { useScroll } from '@/app/ScrollContextProvider';
import panelFragment from '@/shaders/panel/fragment-panel.glsl';
import panelVertex from '@/shaders/panel/vertex-panel.glsl';
import { currentPageState } from '@/store/pageTitleAtom';
import { deviceState } from '@/store/userAgentAtom';
import { AnimationControls } from '@/types/animation';

interface PanelsProps {
  loadedTextures: {
    texture: THREE.Texture;
    aspectRatio: number;
  }[];
  noiseTexture: THREE.Texture;
  telopTexture: THREE.Texture;
  animationControls: AnimationControls;
}

export const Panels = ({
  loadedTextures,
  animationControls,
  noiseTexture,
  telopTexture,
}: PanelsProps) => {
  console.log('re rendered : panels' + performance.now());

  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 7;
  const aspect = 4 / 3;
  const device = useRecoilValue(deviceState);
  const [shaderMaterial, setShaderMaterial] = useState<THREE.ShaderMaterial>();
  const currentPage = useRecoilValue(currentPageState);

  const { indicatorOfGallerySection } = useScroll();

  const { positions, scales, matrices, totalWidth, totalHeight } = useMemo(() => {
    const positions = [];
    const scales = [];
    const matrices = [];

    const scale = 2;
    const panelWidth = aspect * scale;
    const panelHeight = scale;
    const space = 1.01;
    const horizontalSpace = panelWidth * space;
    const verticalSpace = panelHeight * space;

    const totalWidth: number = count * horizontalSpace;
    const totalHeight: number = count * verticalSpace;

    const halfTotalWidth = totalWidth / 2;
    const halfTotalHeight = totalHeight / 2;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const posX = x * horizontalSpace - halfTotalWidth + panelWidth / 2;
        const posY = y * verticalSpace - halfTotalHeight + panelHeight / 2 + halfTotalHeight;
        const posZ = 0;

        positions.push([posX, posY, posZ]);
        scales.push([panelWidth, panelHeight, 1]);

        const matrix = new THREE.Matrix4()
          .makeScale(panelWidth, panelHeight, 1)
          .setPosition(posX, posY, posZ);
        matrices.push(matrix);
      }
    }

    return {
      positions,
      scales,
      matrices,
      totalWidth,
      totalHeight,
    };
  }, [count, aspect]);

  useEffect(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTotalWidth: { value: totalWidth },
        uTotalHeight: { value: totalHeight },
        uTelopAspect: { value: 3.4 },
        uTextures: { value: [] },
        uDevice: { value: null },
        uActivePage: { value: null },
        uNoiseTexture: { value: noiseTexture },
        uTelopTexture: { value: telopTexture },
        uTextureAspectRatios: { value: [] },
        uIsGallerySection: {
          value: null,
        },
        uTime: { value: 0 },
        uTransition: {
          value: 0,
        },
        uIsTransitioning: {
          value: 0,
        },
        uSpeed: { value: 0.004 }, //テロップの流れるスピード
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uRowLengths: { value: [0.82, 0.64, 0.76, 0.82, 0.98] }, //テロップのサンプリングに使用
        uCount: { value: count }, //パネルの枚数
        uAspect: { value: aspect }, //全体のアス比
        uVelocity: { value: 0.0 }, //スクロール速度
      },
      vertexShader: panelVertex,
      fragmentShader: panelFragment,
    });
    setShaderMaterial(material);
  }, [totalWidth, totalHeight, count, aspect, noiseTexture, telopTexture]);

  useEffect(() => {
    if (ref.current) {
      matrices.forEach((matrix, i) => {
        ref.current!.setMatrixAt(i, matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  }, [matrices]);

  useEffect(() => {
    let activePage;
    if (currentPage.title === 'portfolio') {
      activePage = 0;
    } else if (currentPage.title === 'about') {
      activePage = 1;
    } else {
      activePage = 2;
    }

    // console.log(`texutres↓ active page :${currentPage.title} - (${activePage})`);
    // if (loadedTextures.length > 0) {
    //   loadedTextures.forEach((t, index) => {
    //     console.log(`nuber_${index}`, t);
    //   });
    // } else {
    //   console.log(`single_`, loadedTextures);
    // }

    if (!shaderMaterial) return;

    let textures;
    let aspectRatios;

    if (loadedTextures.length > 0) {
      // console.log(loadedTextures.length);

      textures = loadedTextures.map((t) => t.texture);
      aspectRatios = loadedTextures.map((t) => t.aspectRatio);
    }

    shaderMaterial.uniforms.uTextures.value = textures;

    shaderMaterial.uniforms.uTextureAspectRatios.value = aspectRatios;

    if (currentPage.title == 'portfolio') {
      //galleryセクションへの0到達判定はtopページでのみ行う。
      // console.log('gallery section : ' + indicatorOfGallerySection);
      shaderMaterial.uniforms.uIsGallerySection.value = indicatorOfGallerySection == true ? 1 : 0;
    }

    shaderMaterial.uniforms.uActivePage.value = activePage;

    if (device == 'mobile' || device == 'tablet') {
      shaderMaterial.uniforms.uDevice.value = 1;
    } else {
      shaderMaterial.uniforms.uDevice.value = 0;
    }

    shaderMaterial.needsUpdate = true;
  }, [shaderMaterial, loadedTextures, currentPage, device, indicatorOfGallerySection]);

  const geometry = useMemo(() => {
    const baseGeometry = new THREE.PlaneGeometry(1, 1);
    return baseGeometry;
  }, []);

  useFrame((state) => {
    if (shaderMaterial) {
      const { velocityRef, singleProgress, isTransitioning } = animationControls;

      // console.log(
      //   'single transition : ',
      //   singleProgress.current,
      //   'is Transition  :',
      //   isTransitioning?.current,
      //   '\n'
      // );

      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;

      shaderMaterial.uniforms.uTransition.value = singleProgress.current;

      shaderMaterial.uniforms.uIsTransitioning.value = isTransitioning?.current == true ? 1 : 0;

      shaderMaterial.uniforms.uVelocity.value = Math.abs(velocityRef.current);
    }
  });

  if (!shaderMaterial) return null;

  return (
    <Instances limit={count * count} geometry={geometry}>
      <primitive object={shaderMaterial} />
      {positions.map((position, i) => (
        <Instance
          key={i}
          position={new THREE.Vector3().fromArray(position)}
          scale={new THREE.Vector3().fromArray(scales[i])}
        />
      ))}
    </Instances>
  );
};
