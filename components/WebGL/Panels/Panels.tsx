import { Instance, Instances } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import * as THREE from 'three';

// import { useScrollVelocity } from '@/app/ScrollVelocityProvider';
import { useTransitionProgress } from '@/app/TransitionContextProvider';
import { useFrameRate } from '@/hooks/useFrameRate';
import { useIndexTransition } from '@/hooks/useIndexTransition';
import { useTransitionAnimation } from '@/hooks/useTransitionAnimation';
import panelFragment from '@/shaders/panel/fragment-panel.glsl';
import panelVertex from '@/shaders/panel/vertex-panel.glsl';
import { archiveTextureTransitionAtom } from '@/store/activeArchiveNumberAtom';
import { fps } from '@/store/fpsAtom';
import { intializedCompletedAtom } from '@/store/initializedAtom';
import { currentPageState } from '@/store/pageTitleAtom';
import { isGallerySectionAtom, isScrollEndAtom } from '@/store/scrollAtom';
import { deviceState } from '@/store/userAgentAtom';

interface PanelsProps {
  loadedTextures: {
    texture: THREE.Texture;
    aspectRatio: number;
  }[];
  noiseTexture: THREE.Texture;
  telopTexture: THREE.Texture;
}

export const Panels = ({ loadedTextures, noiseTexture, telopTexture }: PanelsProps) => {
  // console.log('re rendered : panels' + performance.now());

  const device = useRecoilValue(deviceState);

  const currentPage = useRecoilValue(currentPageState);

  //シェーダーマテリアルが生成されたら、それを保持
  const [shaderMaterial, setShaderMaterial] = useState<THREE.ShaderMaterial>();

  //ページ状態の変化を検知して動くアニメーションの制御

  // const { velocityRef } = useScrollVelocity();
  //フッター付近への到達判定
  const scrollendTransitionef = useTransitionAnimation({
    trigger: isScrollEndAtom,
    duration: 1.0,
    easing: 'linear',
  });

  //アーカイブの変更検知
  const archiveTransitionRef = useIndexTransition({
    trigger: archiveTextureTransitionAtom,
    duration: 1,
    easing: 'linear',
  });
  const activeIndex = useRecoilValue(archiveTextureTransitionAtom);

  //ページ遷移時のアニメーションに使用
  const { singleProgress, isTransitioning } = useTransitionProgress();

  //ロード完了後のアニメーションに使用
  const loadingTransitionRef = useTransitionAnimation({
    trigger: intializedCompletedAtom,
    duration: 2.4,
    easing: 'linear',
  });

  //インスタンスマトリクスの更新（たぶんいらん）
  const ref = useRef<THREE.InstancedMesh>(null);

  //パネルの数とアスペクト比の設定
  const count = 7;
  const aspect = 4 / 3;

  //DOMにおけるギャラリーセクションへの到達判定
  const isGallerySection = useRecoilValue(isGallerySectionAtom);

  //フレームレート制限ロジック導入
  const frameRate = useRecoilValue(fps);
  const { createFrameCallback } = useFrameRate({ fps: frameRate });

  //パネルの位置とスケールの計算
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

  //パネル用マテリアルの生成と保存
  useEffect(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTotalWidth: { value: totalWidth },
        uTotalHeight: { value: totalHeight },
        uTelopAspect: { value: 3.4 },
        uTextures: { value: [] },
        uDevice: { value: null },
        uActivePage: { value: null },
        uIndexTransition: { value: null },
        uNextIndex: { value: null },
        uCurrentIndex: { value: null },
        uNoiseTexture: { value: noiseTexture },
        uTelopTexture: { value: telopTexture },
        uTextureAspectRatios: { value: [] },
        uIsGallerySection: {
          value: null,
        },
        uIsScrollEnd: {
          value: null,
        },
        uTime: { value: 0 },
        uLoaded: { value: 0 },
        uTransition: {
          value: 0,
        },
        uIsTransitioning: {
          value: 0,
        },
        uSpeed: { value: 0.004 }, //テロップの流れるスピード
        uResolution: {
          value: new THREE.Vector2(
            window.innerWidth * devicePixelRatio,
            window.innerHeight * devicePixelRatio
          ),
        },
        uRowLengths: { value: [0.82, 0.65, 0.765, 0.82, 1.0] }, //テロップのサンプリングに使用
        uCount: { value: count }, //パネルの枚数
        uAspect: { value: aspect }, //全体のアス比
        uVelocity: { value: 0.0 }, //スクロール速度
      },
      vertexShader: panelVertex,
      fragmentShader: panelFragment,
    });
    setShaderMaterial(material);
  }, [totalWidth, totalHeight, count, aspect, noiseTexture, telopTexture]);

  //インスタンスマトリクスの更新(基本的に不要、パネルの数変わらんし)
  useEffect(() => {
    if (ref.current) {
      matrices.forEach((matrix, i) => {
        ref.current!.setMatrixAt(i, matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  }, [matrices]);

  //ユニフォームの更新（ギャラリーセクションへの侵入とページ遷移によるテクスチャの差し替えなど）
  //isGallerySectionまわりはリファクタするかな、Refで扱った方が再レンダリングが少なくて済むかも
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
      shaderMaterial.uniforms.uIsGallerySection.value = isGallerySection == true ? 1 : 0;
    } else {
      //topぺージ以外は常にギャラリーセクションに到達していない状態にする
      shaderMaterial.uniforms.uIsGallerySection.value = 0;
    }

    shaderMaterial.uniforms.uActivePage.value = activePage;

    if (device == 'mobile' || device == 'tablet') {
      shaderMaterial.uniforms.uDevice.value = 1;
    } else {
      shaderMaterial.uniforms.uDevice.value = 0;
    }

    shaderMaterial.needsUpdate = true;
  }, [shaderMaterial, loadedTextures, currentPage, device, isGallerySection]);

  //ベースとなる板ポリの生成
  const geometry = useMemo(() => {
    const baseGeometry = new THREE.PlaneGeometry(1, 1);
    return baseGeometry;
  }, []);

  //リスナーへの登録（リサイズ）
  useEffect(() => {
    const handleResize = () => {
      if (!shaderMaterial) return;

      const dpr = Math.min(window.devicePixelRatio, 2);

      const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(
        dpr
      );

      shaderMaterial.uniforms.uResolution.value = resolution;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [shaderMaterial]);

  useFrame(
    createFrameCallback((state) => {
      if (shaderMaterial) {
        // const { velocityRef, singleProgress, isTransitioning } = animationControls;

        // console.log(
        //   'single transition : ',
        //   singleProgress.current,
        //   'is Transition  :',
        //   isTransitioning?.current,
        //   '\n'
        // );

        shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;

        shaderMaterial.uniforms.uTransition.value = singleProgress.current;

        shaderMaterial.uniforms.uIsScrollEnd.value = scrollendTransitionef.current;

        // console.log('archive change progress :', archiveTransitionRef.current, '\n');

        shaderMaterial.uniforms.uIsTransitioning.value = isTransitioning?.current == true ? 1 : 0;

        shaderMaterial.uniforms.uIndexTransition.value = archiveTransitionRef.current;

        shaderMaterial.uniforms.uNextIndex.value = activeIndex.targetIndex;

        shaderMaterial.uniforms.uCurrentIndex.value = activeIndex.currentIndex;

        // console.log(
        //   'index transition:',
        //   archiveTransitionRef.current,
        //   '\n',
        //   'current index : ',
        //   activeIndex.currentIndex,
        //   '\n',
        //   'next index : ',
        //   activeIndex.targetIndex
        // );

        // shaderMaterial.uniforms.uVelocity.value = Math.abs(velocityRef.current);

        shaderMaterial.uniforms.uLoaded.value = loadingTransitionRef.current;
      }
    })
  );

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
