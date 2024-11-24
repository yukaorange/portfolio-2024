import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import * as THREE from 'three';
import GSAP from 'gsap';
import { useScroll } from '@/app/ScrollContextProvider';
import { currentPageState } from '@/store/pageTitleAtom';

interface ResponsiveCameraProps {
  position: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };
  near: number;
  far: number;
}

export const ResponsiveCamera = ({ position, lookAt, near, far }: ResponsiveCameraProps) => {
  const { camera } = useThree();
  const { indicatorIsGallerySection } = useScroll();
  const isScrolled = indicatorIsGallerySection;
  const currentPage = useRecoilValue(currentPageState);
  const cameraRef = useRef(camera as THREE.PerspectiveCamera);

  const targetPosition = useRef(new THREE.Vector3(position.x, position.y, position.z));
  const targetLookAt = useRef(new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z));
  const targetFov = useRef(45);

  const minWidth = 360;
  const maxWidth = 1440;
  const standardWidth = maxWidth;
  const minFov = 45;
  const maxFov = 50;
  const minLookAtY = 2.7;
  const maxPositionY = 0.25;
  const maxLookAtY = 2.0;
  const minPositionY = 0.5;
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
      newTargetPositionZ -= scaleFactor;
      const moveRange = Math.min(newTargetLookAtY - newTargetPositionY, maxMoveRange);
      newTargetPositionY = Math.min(newTargetPositionY + moveRange, maxPositionY + maxMoveRange);
    } else {
      newTargetPositionZ += scaleFactor;
    }

    targetPosition.current.set(position.x, newTargetPositionY, newTargetPositionZ);
    targetLookAt.current.set(lookAt.x, newTargetLookAtY, lookAt.z);
  }, [position, lookAt, isScrolled, currentPage, getTransformValue]);

  useEffect(() => {
    updateCameraTargets();
  }, [updateCameraTargets]);

  useEffect(() => {
    cameraRef.current.near = near;
    cameraRef.current.far = far;
    cameraRef.current.updateProjectionMatrix();
  }, [near, far]);

  useFrame(() => {
    cameraRef.current.position.lerp(targetPosition.current, 0.02);

    cameraRef.current.lookAt(targetLookAt.current);

    cameraRef.current.fov = THREE.MathUtils.lerp(cameraRef.current.fov, targetFov.current, 0.02);

    cameraRef.current.updateProjectionMatrix();
  });

  return null;
};
