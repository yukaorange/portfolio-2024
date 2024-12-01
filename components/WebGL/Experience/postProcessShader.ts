import postprocessShader from '@/shaders/postprocess/fragment-postprocess.glsl';

import * as THREE from 'three';

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
      uThreshold: { value: checkDevice == 1.0 ? 0.1 : 0.1 }, //閾値(現在、ほぼ全域)
      uStrength: { value: checkDevice == 1.0 ? 0.6 : 0.45 }, //bloom強度
      uRadius: { value: checkDevice == 1.0 ? 0.4 : 1.25 }, //bloom範囲

      //-------なんだかんだいつも必要なやつ--------
      uAspect: { value: width / height },
      uResolution: { value: new THREE.Vector2(width, height) },

      //-------ローディング完了アニメーションにつかう-------
      uLoadingTransition: { value: 0 },
      uTime: { value: 0 },
      uIsMobile: { value: checkDevice },
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
