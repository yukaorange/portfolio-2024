'use client';

import { useControls } from 'leva';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

//キャラクターにあたるライト
export const Lights = () => {
  // const light1 = useControls('Light 1', {
  //   x: { value: 0, min: -10, max: 10, step: 0.1 },
  //   y: { value: 7, min: -10, max: 10, step: 0.1 },
  //   z: { value: 0, min: -10, max: 10, step: 0.1 },
  //   intensity: { value: 150, min: 0, max: 1000, step: 1 },
  //   color: '#ffffff',
  // });

  // const light2 = useControls('Light 2', {
  //   x: { value: -4, min: -10, max: 10, step: 0.1 },
  //   y: { value: 7, min: -10, max: 10, step: 0.1 },
  //   z: { value: 0, min: -10, max: 10, step: 0.1 },
  //   intensity: { value: 150, min: 0, max: 1000, step: 1 },
  //   color: '#ffffff',
  // });

  // const light3 = useControls('Light 3', {
  //   x: { value: 4, min: -10, max: 10, step: 0.1 },
  //   y: { value: 7, min: -10, max: 10, step: 0.1 },
  //   z: { value: 0, min: -10, max: 10, step: 0.1 },
  //   intensity: { value: 150, min: 0, max: 1000, step: 1 },
  //   color: '#ffffff',
  // });

  const light1 = {
    x: 0,
    y: 7,
    z: 2.5,
    intensity: 150,
    color: '#ffffff',
  };
  const light2 = {
    x: -4,
    y: 7,
    z: 2.5,
    intensity: 150,
    color: '#ffffff',
  };
  const light3 = {
    x: 4,
    y: 7,
    z: 2.5,
    intensity: 150,
    color: '#ffffff',
  };

  return (
    <>
      <pointLight
        position={[light1.x, light1.y, light1.z]}
        intensity={light1.intensity}
        color={light1.color}
      />
      <pointLight
        position={[light2.x, light2.y, light2.z]}
        intensity={light2.intensity}
        color={light2.color}
      />
      <pointLight
        position={[light3.x, light3.y, light3.z]}
        intensity={light3.intensity}
        color={light3.color}
      />
    </>
  );
};

export default function ThreeLights() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas>
        <Lights />
        <OrbitControls />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial />
        </mesh>
      </Canvas>
    </div>
  );
}
