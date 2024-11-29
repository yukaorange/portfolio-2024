import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import * as THREE from 'three';

import floorFragment from '@/shaders/floor/fragment-floor.glsl';
import floorVertex from '@/shaders/floor/vertex-floor.glsl';
import { iphoneState } from '@/store/userAgentAtom';
import { AnimationControls } from '@/types/animation';

interface FloorProps {
  textures: {
    roughness: THREE.Texture;
    normal: THREE.Texture;
  };
}

export const Floor = ({ textures }: FloorProps) => {
  const deviceState = useRecoilValue(iphoneState);

  const floorMaterial = useMemo(() => {
    if (!textures) return;

    const { roughness, normal } = textures;
    const lightIntensity = 0.25;

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uRoughness: {
          value: roughness,
        },
        uNormal: {
          value: normal,
        },
        uTime: {
          value: 0,
        },
        uLightPositions: {
          value: [
            new THREE.Vector3(0, 7, 10),
            new THREE.Vector3(-5, 7, 10),
            new THREE.Vector3(5, 7, 10),
          ],
        },
        uLightColors: {
          value: [new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1)],
        },
        uIsMobile: { value: deviceState ? 1 : 0 },
        uLightIntensities: { value: [lightIntensity, lightIntensity * 0.1, lightIntensity * 0.1] },
      },
      vertexShader: floorVertex,
      fragmentShader: floorFragment,
    });

    return shaderMaterial;
  }, [textures, deviceState]);

  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[1, 1, 1]}
      material={floorMaterial}
    >
      <planeGeometry args={[100, 100]} />
    </mesh>
  );
};
