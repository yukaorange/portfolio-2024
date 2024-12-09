import * as THREE from 'three';

import postprocessShader from '@/shaders/postprocess/fragment-postprocess.glsl';

export const postProcessShader = (width: number, height: number, device: string) => {
  const checkDevice = device === 'mobile' ? 1.0 : 0.0; //1.0 for mobile, 0.0 for desktop

  const config = {
    uniforms: {
      tDiffuse: { value: null },

      //-------色調の補正につかうパラメータ-------
      uGamma: { value: 1.5 },
      uOffset: { value: 0.5 },
      uDarkness: { value: 0.8 },

      //-------自作bloomエフェクトに使う-------
      //1.0 for mobile, 0.0 for desktopです
      uThreshold: { value: checkDevice == 1.0 ? 0.1 : 0.1 }, //閾値(現在、ほぼ全域)
      uStrength: { value: checkDevice == 1.0 ? 0.08 : 0.45 }, //bloom強度
      uRadius: { value: checkDevice == 1.0 ? .7 : 1.25 }, //bloom範囲

      //-------なんだかんだいつも必要なやつ--------
      uAspect: { value: width / height },
      uResolution: { value: new THREE.Vector2(width, height) },

      //-------ローディング完了アニメーションにつかう-------
      uLoadingTransition: { value: 0 },
      uLoadingTransitionEaseIn: { value: 0 },
      uLoadingTransitionEaseOut: { value: 0 },
      uTime: { value: 0 },
      uIsMobile: { value: checkDevice },

      //ページの状態
      uIsScrollStart: { value: 0 },
      uActivePage: { value: 0 },
      uTransition: { value: 0 },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
      `,
    fragmentShader: postprocessShader,
  };

  return config;
};
