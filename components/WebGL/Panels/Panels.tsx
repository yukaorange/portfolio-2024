import { Instance, Instances } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { AnimationControls } from '@/types/animation';

import panelFragment from '@/shaders/panel/fragment-panel.glsl';
import panelVertex from '@/shaders/panel/vertex-panel.glsl';

interface PanelsProps {
  loadedTextures: {
    texture: THREE.Texture;
    aspectRatio: number;
  }[];
  animationControls: AnimationControls;
}

export const Panels = ({ loadedTextures, animationControls }: PanelsProps) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 7;
  const aspect = 4 / 3;
  const [shaderMaterial, setShaderMaterial] = useState<THREE.ShaderMaterial>();

  // useEffect(() => {
  //   console.log(loadedTextures);
  // }, [loadedTextures]);

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
        uTextures: { value: [] },
        uTextureAspectRatios: { value: [] },
        uTime: { value: 0 },
        uSpeed: { value: 0.02 },
        uRowLengths: { value: [0.82, 0.64, 0.76, 0.82, 0.98] }, //テロップのサンプリングに使用
        uCount: { value: count },
        uAspect: { value: aspect },
        uVelocity: { value: 0.0 },
      },
      vertexShader: panelVertex,
      fragmentShader: panelFragment,
    });
    setShaderMaterial(material);
  }, [totalWidth, totalHeight, count, aspect]);

  useEffect(() => {
    if (ref.current) {
      matrices.forEach((matrix, i) => {
        ref.current!.setMatrixAt(i, matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  }, [matrices]);

  useEffect(() => {
    if (shaderMaterial && loadedTextures.length > 0) {
      const textures = loadedTextures.map((t) => t.texture);
      const aspectRatios = loadedTextures.map((t) => t.aspectRatio);

      shaderMaterial.uniforms.uTextures.value = textures;
      shaderMaterial.uniforms.uTextureAspectRatios.value = aspectRatios;
      shaderMaterial.needsUpdate = true;
    }
  }, [shaderMaterial, loadedTextures]);

  // useEffect(() => {
  //   const textures = loadedTextures.map((texture) => {
  //     return texture.texture;
  //   });
  //   const aspectRatios = loadedTextures.map((texture) => {
  //     return texture.aspectRatio;
  //   });

  //   panelMaterial.uniforms.uTextures.value = textures;
  //   panelMaterial.uniforms.uTextureAspectRatios.value = aspectRatios;
  //   panelMaterial.needsUpdate = true;
  // }, [loadedTextures]);

  const geometry = useMemo(() => {
    const baseGeometry = new THREE.PlaneGeometry(1, 1);
    return baseGeometry;
  }, []);

  useFrame((state) => {
    if (shaderMaterial) {
      const { velocityRef } = animationControls;

      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
      shaderMaterial.uniforms.uVelocity.value = Math.abs(velocityRef.current);
    }
  });

  if (!shaderMaterial) return null;

  return (
    <Instances limit={count * count} ref={ref} geometry={geometry}>
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
