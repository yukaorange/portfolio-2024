/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/models/scene_animation.glb -o ./components/WebGL/Model/Model.tsx -r public --types --draco 
*/
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

import { useTransitionProgress } from '@/app/TransitionContextProvider';
import { useFrameRate } from '@/hooks/useFrameRate';
import { useTransitionAnimation } from '@/hooks/useTransitionAnimation';
import suitcaseFragment from '@/shaders/suitcase/fragment-suitcase.glsl';
import suitcaseVertex from '@/shaders/suitcase/vertex-suitcase.glsl';
import { fps } from '@/store/fpsAtom';
import { loadProgressAtom } from '@/store/loadProgressAtom';
import { isScrollEndAtom, isScrollStartAtom } from '@/store/scrollAtom';
import { useSetModelLoaded } from '@/store/textureAtom';
import { deviceState } from '@/store/userAgentAtom';

import { ExtendedMaterial } from './ExtendedMaterial';

type GLTFResult = GLTF & {
  nodes: {
    body: THREE.SkinnedMesh;
    bottoms: THREE.SkinnedMesh;
    cap: THREE.SkinnedMesh;
    comtac: THREE.SkinnedMesh;
    comtac_yeahpad: THREE.SkinnedMesh;
    glass: THREE.SkinnedMesh;
    goggle_belt: THREE.SkinnedMesh;
    goggle_frame: THREE.SkinnedMesh;
    Head_1: THREE.SkinnedMesh;
    shoes: THREE.SkinnedMesh;
    tops: THREE.SkinnedMesh;
    suitcase: THREE.Mesh;
    Root: THREE.Bone;
  };
  materials: object;
  animations: GLTFAction[];
};

type ActionName = 'ArmatureAction';

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GroupProps = JSX.IntrinsicElements['group'];

interface ModelProps extends GroupProps {
  textures?: {
    characterTexture: THREE.Texture;
    suitcaseTexture: THREE.Texture;
  };
}

export const Model = ({ textures, ...props }: ModelProps) => {
  const device = useRecoilValue(deviceState);
  // console.log('re rendered : model' + performance.now());
  const setProgress = useSetRecoilState(loadProgressAtom);

  //---------モデルのロード---------
  const { nodes, materials, animations } = useGLTF('/models/scene_animation_02.glb') as GLTFResult;

  //ロード完了を通知
  const setModelLoaded = useSetModelLoaded();
  useEffect(() => {
    //ロード完了を通知（useGLTFによるnodesの変更はロード完了時に発生するので、この通知は一度だけ起こる算段）
    if (nodes && Object.keys(nodes).length > 0) {
      setModelLoaded(true);

      setProgress((prev) => {
        return {
          ...prev,
          modelProgress: Object.keys(nodes).length,
          modelTotal: Object.keys(nodes).length,
        };
      });
      // console.log('model loaded  initialize is going to be standby');
    }
  }, [nodes, setModelLoaded, setProgress]);

  //ページ状態の変化を検知して動くアニメーションの制御
  const scrollStartTransitionRef = useTransitionAnimation({
    trigger: isScrollStartAtom,
    duration: 0.64,
  });
  const scrollendTransitionef = useTransitionAnimation({
    trigger: isScrollEndAtom,
    duration: 1.0,
  });
  const { singleProgress } = useTransitionProgress();

  //フレームレート制限ロジック導入
  const frameRate = useRecoilValue(fps);
  const { createFrameCallback } = useFrameRate({ fps: frameRate });

  //キャラクターに使用するもの
  const group = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, group);

  //スーツケースに使用するもの
  const suitcaseRef = useRef<THREE.Mesh>(null);
  const suitcaseTargetPosition = useRef<THREE.Vector3>(new THREE.Vector3());

  //キャラクター用の拡張マテリアルへの参照
  const extendedMaterials = useRef<{ [key: string]: ExtendedMaterial }>({});

  //キャラクター用のマテリアル
  useEffect(() => {
    Object.entries(materials).forEach(([name, material]) => {
      //スーツケースのシェーダーはスクラッチするので除外
      if (name === 'suitcase') return;

      const extendedMaterial = new ExtendedMaterial();

      //ExtendedMaterialには独自のコードを追加してある。それに対して、blenderからエクスポートしたStandardMaterialの設定が上乗せされる（プロパティが被っている部分は上書きされる）
      extendedMaterial.copy(material as THREE.Material);

      extendedMaterials.current[name] = extendedMaterial;
    });
  }, [materials]);

  //キャラクターアニメーション
  useEffect(() => {
    const action = actions?.['ArmatureAction'];

    if (action) {
      action.reset().fadeIn(0.5).play();
      action.clampWhenFinished = true;
      action.loop = THREE.LoopRepeat;
    }

    return () => {
      if (action) {
        action.fadeOut(0.5);
      }
    };
  }, [actions]);

  //スーツケース用のマテリアル
  const suitcaseMaterial = useMemo(() => {
    if (!textures) return;

    const dpr = Math.min(window.devicePixelRatio, 1);

    const { suitcaseTexture } = textures;

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: {
          value: suitcaseTexture,
        },
        uEffectTexture: {
          value: null,
        },
        uLightPosition: {
          value: new THREE.Vector3(0.0, 6.0, 10.0),
        },
        uIsScrollEnd: {
          value: 0,
        },
        uTransition: {
          value: 0,
        },
        uAspect: {
          value: window.innerWidth / window.innerHeight,
        },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr),
        },
        uTime: {
          value: 0,
        },
        uSaturation: {
          value: 0.2,
        },
        uRefractPower: {
          value: 1.0,
        },
        uShininess: {
          value: 80.0,
        },
        uDiffuseness: {
          value: 0.01,
        },
        uFresnelPower: {
          value: 4.0,
        },
        uIorR: {
          value: 1.15,
        },
        uIorG: {
          value: 1.17,
        },
        uIorB: {
          value: 1.14,
        },
        uIorY: {
          value: 1.16,
        },
        uIorC: {
          value: 1.17,
        },
        uIorP: {
          value: 1.18,
        },
        uGridCount: {
          value: 4.0,
        },
      },
      vertexShader: suitcaseVertex,
      fragmentShader: suitcaseFragment,
    });

    return shaderMaterial;
  }, [textures]);

  //リサイズ時の更新(スーツケースのマテリアル)
  useEffect(() => {
    const handleResize = () => {
      if (!suitcaseMaterial) return;
      // console.log('resize @ suitcase in Model  ');
      const dpr = Math.min(window.devicePixelRatio, 1);

      suitcaseMaterial.uniforms.uResolution.value.set(
        window.innerWidth * dpr,
        window.innerHeight * dpr
      );
      suitcaseMaterial.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [suitcaseMaterial]);

  //スーツケースの位置算出につかう
  const calculateSuitcasePosition = useCallback((width: number): [number, number, number] => {
    const BREAKPOINTS = {
      mobile: 360,
      desktop: 1440,
    };

    const POSITIONS = {
      mobile: [-0.55, 3.3, -1.2],
      desktop: [-0.55, 3.15, 2.2],
    };

    //画面幅に応じて、0 - 1の範囲をとる
    const moveRange = Math.max(
      0,
      Math.min(1, (width - BREAKPOINTS.mobile) / (BREAKPOINTS.desktop - BREAKPOINTS.mobile))
    );

    //0のときはmobileの位置、1のときはdesktopの位置をとるようになる
    return [
      THREE.MathUtils.lerp(POSITIONS.mobile[0], POSITIONS.desktop[0], moveRange),
      THREE.MathUtils.lerp(POSITIONS.mobile[1], POSITIONS.desktop[1], moveRange),
      THREE.MathUtils.lerp(POSITIONS.mobile[2], POSITIONS.desktop[2], moveRange),
    ];
  }, []);

  //----------raf----------
  useFrame(
    createFrameCallback((state, delta) => {
      const { clock } = state;

      const elapsedTime = clock.getElapsedTime();

      //線形補完の係数
      // const lerpFactor = 1.0 - Math.pow(0.001, delta);
      const lerpFactor = 0.24; //スーツケースの移動は早くていい

      //スーツケースの初期位置
      const originalSuitcasePosition = {
        x: 0.551,
        y: 0.302,
        z: -4.68,
      };
      //スーツケースのアニメーション
      if (suitcaseRef.current) {
        //条件に応じてスーツケースを移動させる
        const suitcaseShaderMaterial = suitcaseRef.current.material as THREE.ShaderMaterial;

        suitcaseShaderMaterial.uniforms.uTime.value = elapsedTime;

        suitcaseShaderMaterial.uniforms.uIsScrollEnd.value = scrollendTransitionef.current;

        suitcaseShaderMaterial.uniforms.uTransition.value = singleProgress.current;

        //----------スーツケースの位置決定----------
        if (scrollendTransitionef.current >= 0.25) {
          //1だと遅く感じる。まあこの辺は微調整で

          //フッター付近でのふるまい
          //回転を加える
          suitcaseRef.current.rotation.x = (Math.PI * 1) / 16;
          if (device === 'mobile') {
            suitcaseRef.current.rotation.y += (delta * Math.PI * 1) / 24;
          } else {
            suitcaseRef.current.rotation.y += (delta * Math.PI * 1) / 8;
          }
          // suitcaseRef.current.rotation.y += (delta * Math.PI * 1) / 2;//色の確認時に早く回転させたい
          suitcaseRef.current.rotation.z = (Math.PI * 1) / 8;

          // 画面幅に基づいて位置を計算
          const calculatedPosition = calculateSuitcasePosition(window.innerWidth);

          suitcaseTargetPosition.current.x = calculatedPosition[0] + originalSuitcasePosition.x;
          suitcaseTargetPosition.current.y = calculatedPosition[1] + originalSuitcasePosition.y;
          suitcaseTargetPosition.current.z = calculatedPosition[2] + originalSuitcasePosition.z;
        } else {
          suitcaseTargetPosition.current.x = originalSuitcasePosition.x;
          suitcaseTargetPosition.current.y = originalSuitcasePosition.y;
          suitcaseTargetPosition.current.z = originalSuitcasePosition.z;

          suitcaseRef.current.rotation.x = 0;
          suitcaseRef.current.rotation.y = 0;
          suitcaseRef.current.rotation.z = 0;
        }

        suitcaseRef.current.position.lerp(suitcaseTargetPosition.current, lerpFactor);
      }

      //キャラクターのアニメーション
      const boundingBox = new THREE.Box3();
      if (group.current) {
        boundingBox.setFromObject(group.current);
      }

      Object.values(extendedMaterials.current).forEach((material) => {
        const time = state.clock.getElapsedTime();
        const progress = scrollStartTransitionRef.current;

        material.update(time, progress, boundingBox);
      });
    }),
    1
  );

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature">
          <primitive object={nodes.Root} />
          {Object.entries(nodes).map(([name, node]) => {
            const originalMaterial = (node as THREE.Mesh).material as THREE.Material;

            let extendedMaterial;

            if (originalMaterial) {
              extendedMaterial = extendedMaterials.current[originalMaterial.name];
            }

            if (node instanceof THREE.SkinnedMesh) {
              return (
                <skinnedMesh
                  key={name}
                  name={name}
                  geometry={node.geometry}
                  material={extendedMaterial || node.material}
                  skeleton={node.skeleton}
                />
              );
            }
            return null;
          })}
        </group>

        {/* スーツケース */}
        <mesh
          ref={suitcaseRef}
          name="suitcase"
          geometry={nodes.suitcase.geometry}
          material={suitcaseMaterial}
          // position={[0.551, 0.282, -4.68]}//blenderにて設定された初期位置
        />
      </group>
    </group>
  );
};

useGLTF.preload('/models/scene_animation_02.glb');
