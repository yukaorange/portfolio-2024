import React, { useMemo, useRef, useEffect } from 'react';
import { Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import panelFragment from '@/shaders/panel/fragment-panel.glsl';
import panelVertex from '@/shaders/panel/vertex-panel.glsl';

interface PanelsProps {
  textures: THREE.Texture[];
}

export const Panels = ({ textures }: PanelsProps) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 7;
  const aspect = 4 / 3;

  // useEffect(() => {
  //   console.log(textures);
  // }, [textures]);

  const panelMaterial = useMemo(() => {
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        // uResolution: {
        //   value: null,
        // },
        // uTextureResolution: {
        //   value: null,
        // },
        uTime: {
          value: 0,
        },
        uCount: { value: count },
        uAspect: {
          value: aspect,
        },
      },
      vertexShader: panelVertex,
      fragmentShader: panelFragment,
    });

    // const meshBasicMaterial = new THREE.MeshBasicMaterial({
    //   map: suitcaseTexture,
    // });

    return shaderMaterial;
  }, []);

  const { positions, scales, matrices, indices } = useMemo(() => {
    const positions = [];
    const scales = [];
    const matrices = [];
    const indices = [];

    const scale = 2;
    const panelWidth = aspect * scale;
    const panelHeight = scale;
    const space = 1.01;
    const horizontalSpace = panelWidth * space;
    const verticalSpace = panelHeight * space;

    const totalWidth = count * horizontalSpace;
    const totalHeight = count * verticalSpace;
    const halfTotalWidth = totalWidth / 2;
    const halfTotalHeight = totalHeight / 2;
    let index = 1;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const posX = x * horizontalSpace - halfTotalWidth + panelWidth / 2;
        const posY = y * verticalSpace - halfTotalHeight + panelHeight / 2 + halfTotalHeight;
        const posZ = 0;

        positions.push([posX, posY, posZ]);
        scales.push([panelWidth, panelHeight, 1]);

        indices.push(index);

        const matrix = new THREE.Matrix4()
          .makeScale(panelWidth, panelHeight, 1)
          .setPosition(posX, posY, posZ);
        matrices.push(matrix);
        index++;
      }
    }

    return {
      positions,
      scales,
      matrices,
      indices,
    };
  }, [count]);

  const geometry = useMemo(() => {
    const baseGeometry = new THREE.PlaneGeometry(1, 1);
    return baseGeometry;
  }, []);

  useFrame((state) => {
    panelMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    if (ref.current && !ref.current.instanceMatrix.needsUpdate) {
      matrices.forEach((matrix, i) => {
        ref.current!.setMatrixAt(i, matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  useEffect(() => {
    if (ref.current) {
      const indexAttribute = new THREE.InstancedBufferAttribute(new Float32Array(indices), 1);

      ref.current.geometry.setAttribute('aIndex', indexAttribute);

      // console.log(ref.current.geometry.attributes);
    }
  }, [indices]);

  return (
    <Instances limit={count * count} ref={ref} geometry={geometry}>
      <primitive object={panelMaterial} />
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
