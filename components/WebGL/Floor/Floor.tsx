import { MeshReflectorMaterial } from '@react-three/drei';
import React from 'react';
import * as THREE from 'three';

interface FloorProps {
  color: number[];
  // textures: {
  //   roughness: THREE.Texture;
  //   normal: THREE.Texture;
  // };
}

export const Floor = ({ color: [r, g, b] }: FloorProps) => {
  // const { normal, roughness } = textures;

  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        // normalMap={normal}
        // roughnessMap={roughness}
        normalScale={new THREE.Vector2(1, 1)}
        dithering={true} // ディザリングを有効にして、色のバンディングを減少
        color={[r, g, b]}
        roughness={0.1} // 表面の粗さ。値が小さいほど反射が鮮明になる
        blur={[100, 100]} // 反射のぼかし具合。[横方向のぼかし, 縦方向のぼかし]
        mixBlur={1.4} // ぼかしの混合度。値が大きいほどぼかしが強くなる
        mixStrength={150} // 反射の強さ。値が大きいほど反射が強くなる
        mixContrast={0.86} // 反射のコントラスト。値が大きいほどコントラストが強くなる
        resolution={1024}
        mirror={0.8} // 鏡面反射の強さ。値が大きいほど鏡のような反射になる
        depthScale={0.98} // 深度に基づく反射の強さのスケール
        minDepthThreshold={0.1} // 反射が始まる最小深度のしきい値
        maxDepthThreshold={0.8} // 反射が最大になる深度のしきい値
        depthToBlurRatioBias={0.25} // 深度に基づくぼかしの比率のバイアス
        reflectorOffset={0.01} // 反射面のオフセット。z-fightingを防ぐのに役立つ
        metalness={0.9} // 金属感。値が大きいほど金属のような反射になる
      />
    </mesh>
  );
};
