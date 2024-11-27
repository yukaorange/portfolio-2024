import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import * as THREE from 'three';

import { useTransitionProgress } from '@/app/TransitionContextProvider';
import { currentPageState } from '@/store/pageTitleAtom';
import { isGallerySectionAtom } from '@/store/scrollAtom';

interface ResponsiveCameraProps {
  position: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };
  near: number;
  far: number;
}

export const ResponsiveCamera = ({ position, lookAt, near, far }: ResponsiveCameraProps) => {
  // console.log('re rendered : responsive camera' + performance.now());

  const { camera } = useThree();
  const isGallerySection = useRecoilValue(isGallerySectionAtom);
  const isScrolled = isGallerySection;
  const currentPage = useRecoilValue(currentPageState);
  const cameraRef = useRef(camera as THREE.PerspectiveCamera);
  const { isTransitioning } = useTransitionProgress();

  const targetPosition = useRef(new THREE.Vector3(position.x, position.y, position.z));
  const targetLookAt = useRef(new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z));
  const targetFov = useRef(45);

  const minWidth = 360;
  const maxWidth = 1440;
  const standardWidth = maxWidth;
  const minFov = 50; //@mobile
  const maxFov = 40;
  const minLookAtY = 2.0;
  const maxPositionY = 0.25;
  const maxLookAtY = 2.25;
  const minPositionY = 0.275;
  const maxMoveRange = 3.0;

  const getTransformValue = useCallback((windowInnerWidth: number) => {
    return Math.max(0, Math.min(1, (windowInnerWidth - minWidth) / (maxWidth - minWidth)));
  }, []);

  const updateCameraTargets = useCallback(() => {
    const isSubPage = currentPage.title !== 'portfolio';
    const currentWidth = window.innerWidth;

    const transformValue = getTransformValue(currentWidth);
    const transformValueReverse = 1 - transformValue;
    const scaleFactor = Math.max(standardWidth / currentWidth, 1);

    targetFov.current = minFov + transformValue * (maxFov - minFov);
    const baseLookAtY = minLookAtY + transformValueReverse * (maxLookAtY - minLookAtY);

    let newTargetLookAtY = baseLookAtY;
    let newTargetPositionZ = position.z;
    let newTargetPositionY = minPositionY + transformValue * (maxPositionY - minPositionY);

    if (isScrolled || isSubPage) {
      newTargetLookAtY = Math.min(baseLookAtY + maxMoveRange, maxLookAtY + maxMoveRange);

      const moveRange = Math.min(newTargetLookAtY - newTargetPositionY, maxMoveRange);

      newTargetPositionY = Math.min(newTargetPositionY + moveRange, maxPositionY + maxMoveRange);

      newTargetPositionZ -= scaleFactor;
    } else {
      newTargetPositionZ += scaleFactor;
    }

    targetPosition.current.set(position.x, newTargetPositionY, newTargetPositionZ);

    targetLookAt.current.set(lookAt.x, newTargetLookAtY, lookAt.z);
  }, [position, lookAt, isScrolled, currentPage, getTransformValue, standardWidth]);

  useEffect(() => {
    updateCameraTargets();
  }, [updateCameraTargets]);

  useEffect(() => {
    cameraRef.current.near = near;
    cameraRef.current.far = far;
    cameraRef.current.updateProjectionMatrix();
  }, [near, far]);

  useFrame((state, delta) => {
    const lerpFactor = 1.0 - Math.pow(0.1, delta);
    //0.0秒: 1.0 - Math.pow(0.2, 0.0) = 0.0  // 開始
    //0.2秒: 1.0 - Math.pow(0.2, 0.2) ≈ 0.63 // 残り37%
    //0.4秒: 1.0 - Math.pow(0.2, 0.4) ≈ 0.86 // 残り14%
    //0.6秒: 1.0 - Math.pow(0.2, 0.6) ≈ 0.95 // 残り5%

    //ページトランジション中はカメラの位置を動かさな
    if (isTransitioning.current == true) {
      return;
    }

    cameraRef.current.position.lerp(targetPosition.current, lerpFactor);

    cameraRef.current.lookAt(targetLookAt.current);

    cameraRef.current.fov = THREE.MathUtils.lerp(
      cameraRef.current.fov,
      targetFov.current,
      lerpFactor
    );

    cameraRef.current.updateProjectionMatrix();
  });

  return null;
};
