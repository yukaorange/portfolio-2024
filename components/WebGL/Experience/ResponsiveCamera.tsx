import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import * as THREE from 'three';

import { useScroll } from '@/app/ScrollContextProvider';
import { currentPageState } from '@/store/pageTitleAtom';

interface ResponsiveCameraProps {
  position: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };
  near: number;
  far: number;
}

export const ResponsiveCamera = ({ position, lookAt, near, far }: ResponsiveCameraProps) => {
  const currentPage = useRecoilValue(currentPageState);
  const { indicatorOfScrollStart } = useScroll();
  const { camera } = useThree();
  const lastTimeRef = useRef(0);
  //cameraRef
  const cameraRef = useRef(camera as THREE.PerspectiveCamera);
  const targetPositionRef = useRef({ x: 0, y: 0, z: 0 });
  const currentLookAtRef = useRef({ x: 0, y: 0, z: 0 });
  const targetLookAtRef = useRef({ x: 0, y: 0, z: 0 });
  const targetFovRef = useRef(45);
  const moveRangeRef = useRef(0); //lookatと同じ高さにカメラを持っていくための値

  //camera property
  const minWidth = 360;
  const maxWidth = 1440;
  const standardWidth = maxWidth;
  const minFov = 45;
  const maxFov = 50;
  const minLookAtY = 2.7; //lookat y @desktop
  const maxPositionY = 0.25; //camera y @desktop
  const maxLookAtY = 1.75; //lookat y @mobile
  const minPositionY = 0.15; //camera y @mobile
  const lerpingCoefficient = 0.98;

  useEffect(() => {
    const updateCameraPosition = () => {
      cameraRef.current.position.set(position.x, position.y, position.z);
      cameraRef.current.near = near;
      cameraRef.current.far = far;
      cameraRef.current.updateProjectionMatrix();
    };
    updateCameraPosition();
  }, [position, near, far, lookAt]);

  const getTransformValue = (windowInnerWidth: number) => {
    return Math.max(0, Math.min(1, (windowInnerWidth - minWidth) / (maxWidth - minWidth))); //最大と最小を補完的に変化させるテクニック
  };

  const getTransformValueReverse = (windowInnerWidth: number) => {
    return 1 - getTransformValue(windowInnerWidth);
  };

  const getScaleFactor = (windowInnerWidth: number) => {
    return Math.max(standardWidth / windowInnerWidth, 1);
  };

  const updateTargets = (deltaTime: number) => {
    const isSubPage = currentPage.title !== 'portfolio';
    const isScrolled = indicatorOfScrollStart.current;
    const currentWidth = window.innerWidth;
    const transformValue = getTransformValue(currentWidth);
    const transformValueReverse = getTransformValueReverse(currentWidth);
    const scaleFactor = getScaleFactor(currentWidth);

    const timeBasedLerp = Math.min(deltaTime * lerpingCoefficient, 1.0); // 2.0 はlerpingの速さを調整するための値

    // Update target values

    //fov
    targetFovRef.current = maxFov - transformValue * (maxFov - minFov);

    //lookAt
    if (isScrolled || isSubPage) {
      targetLookAtRef.current.y =
        minLookAtY + transformValueReverse * (maxLookAtY - minLookAtY) + 3.0;
    } else {
      targetLookAtRef.current.y = minLookAtY + transformValueReverse * (maxLookAtY - minLookAtY);
    }

    currentLookAtRef.current.x = THREE.MathUtils.lerp(
      currentLookAtRef.current.x,
      targetLookAtRef.current.x,
      timeBasedLerp
    );
    currentLookAtRef.current.y = THREE.MathUtils.lerp(
      currentLookAtRef.current.y,
      targetLookAtRef.current.y,
      timeBasedLerp
    );
    currentLookAtRef.current.z = THREE.MathUtils.lerp(
      currentLookAtRef.current.z,
      targetLookAtRef.current.z,
      timeBasedLerp
    );

    //position
    targetPositionRef.current.x = position.x;
    if (isScrolled || isSubPage) {
      targetPositionRef.current.z = position.z - scaleFactor;
      const target = targetLookAtRef.current.y - cameraRef.current.position.y;
      moveRangeRef.current = target;
      targetPositionRef.current.y =
        minPositionY + transformValue * (maxPositionY - minPositionY) + moveRangeRef.current;
    } else {
      targetPositionRef.current.z = position.z + scaleFactor;
      moveRangeRef.current = 0;
      targetPositionRef.current.y = minPositionY + transformValue * (maxPositionY - minPositionY);
    }
  };

  const updateCameraProperty = (deltaTime: number) => {
    const timeBasedLerp = Math.min(deltaTime * lerpingCoefficient, 1.0);

    cameraRef.current.fov = THREE.MathUtils.lerp(
      cameraRef.current.fov,
      targetFovRef.current,
      timeBasedLerp
    );

    const currentPos = cameraRef.current.position;
    currentPos.x = THREE.MathUtils.lerp(currentPos.x, targetPositionRef.current.x, timeBasedLerp);
    currentPos.y = THREE.MathUtils.lerp(currentPos.y, targetPositionRef.current.y, timeBasedLerp);
    currentPos.z = THREE.MathUtils.lerp(currentPos.z, targetPositionRef.current.z, timeBasedLerp);

    cameraRef.current.lookAt(
      currentLookAtRef.current.x,
      currentLookAtRef.current.y,
      currentLookAtRef.current.z
    );

    // console.log(
    //   'camera property',
    //   'positon y:',
    //   cameraRef.current.position.y,
    //   targetPositionRef.current.y,
    //   '\n',
    //   'lookAt y:',
    //   targetLookAtRef.current.y,
    //   '\n',
    //   'fov:',
    //   cameraRef.current.fov,
    //   '\n',
    //   'moveRange : ',
    //   moveRangeRef.current
    // );
  };

  useFrame((state) => {
    const currentTime = state.clock.getElapsedTime();
    const deltaTime = currentTime - lastTimeRef.current;

    lastTimeRef.current = currentTime;

    updateTargets(deltaTime);

    updateCameraProperty(deltaTime);

    cameraRef.current.updateProjectionMatrix();
  });

  return null;
};
