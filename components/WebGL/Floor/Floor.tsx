// import { MeshReflectorMaterial } from '@react-three/drei';
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { AnimationControls } from '@/types/animation';

import floorFragment from '@/shaders/floor/fragment-floor.glsl';
import floorVertex from '@/shaders/floor/vertex-floor.glsl';

interface FloorProps {
  color: number[];
  textures: {
    roughness: THREE.Texture;
    normal: THREE.Texture;
  };
  animationControls: AnimationControls;
}

export const Floor = ({ color: [r, g, b], textures, animationControls }: FloorProps) => {
  const floorMaterial = useMemo(() => {
    if (!textures) return;

    const { roughness, normal } = textures;

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        // uResolution: {
        //   value: null,
        // },
        // uTextureResolution: {
        //   value: null,
        // },
        uRoughness: {
          value: roughness,
        },
        uNormal: {
          value: normal,
        },
        uTime: {
          value: 0,
        },
        // uAspect: {
        //   value: aspect,
        // },
        uColor: { value: new THREE.Vector3(r, g, b) },
      },
      vertexShader: floorVertex,
      fragmentShader: floorFragment,
    });

    return shaderMaterial;
  }, [r, g, b, textures]);

  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[1, 1, 1]}
      material={floorMaterial}
    >
      <planeGeometry args={[100, 100]} />
      {/* <MeshReflectorMaterial
        envMapIntensity={0}
        normalScale={new THREE.Vector2(0.15, 0.15)}
        dithering={true}
        roughness={0.0}
        metalness={0.7}
        blur={[0.001, 0.001]}
        mixBlur={0}
        mixStrength={80}
        mixContrast={1}
        resolution={1024}
        mirror={0}
        depthScale={0.01}
        minDepthThreshold={0.1}
        maxDepthThreshold={1}
        depthToBlurRatioBias={0.25}
        reflectorOffset={0.1}
      /> */}
    </mesh>
  );
};
