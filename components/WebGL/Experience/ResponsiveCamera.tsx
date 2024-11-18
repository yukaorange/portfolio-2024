import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ResponsiveCameraProps {
  position: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };
  near: number;
  far: number;
}

export const ResponsiveCamera = ({ position, lookAt, near, far }: ResponsiveCameraProps) => {
  const { viewport, camera } = useThree();
  const cameraRef = useRef(camera as THREE.PerspectiveCamera);

  useEffect(() => {
    const updateCameraPosition = () => {
      cameraRef.current.position.set(position.x, position.y, position.z);
      cameraRef.current.near = near;
      cameraRef.current.far = far;
      cameraRef.current.updateProjectionMatrix();
    };

    updateCameraPosition();
  }, [viewport, position, near, far]);

  useFrame((state) => {
    const { clock } = state;

    const minWidth = 360;
    const maxWidth = 1440;
    const standardWidth = maxWidth;
    const minFov = 45;
    const maxFov = 60;
    const currentWidth = window.innerWidth;
    const aspect = window.innerWidth / window.innerHeight;

    const transformValue = Math.max(
      0,
      Math.min(1, (currentWidth - minWidth) / (maxWidth - minWidth))
    ); //最大と最小を補完的に変化させるテクニック

    const fov = maxFov - transformValue * (maxFov - minFov);

    cameraRef.current.fov = fov;

    // const caluclatedWidth = 2 * Math.tan((fov / 2) * (Math.PI / 180)) * camera.position.z * aspect;
    // const caluclatedHeight = 2 * Math.tan((fov / 2) * (Math.PI / 180)) * camera.position.z;

    const scaleFactor = Math.max(standardWidth / window.innerWidth, 1);

    const positionZ = position.z + scaleFactor;
    const positionX = position.x;

    cameraRef.current.position.set(positionX, position.y, positionZ);

    // console.log(
    //   'camera position z:',
    //   cameraRef.current.position.z,
    //   '\n',
    //   'scale factor',
    //   scaleFactor
    // );

    cameraRef.current.lookAt(lookAt.x, lookAt.y, lookAt.z);
    cameraRef.current.updateProjectionMatrix();
  });

  return null;
};
