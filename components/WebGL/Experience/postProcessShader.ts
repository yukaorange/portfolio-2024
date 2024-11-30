import postprocessShader from '@/shaders/postprocess/fragment-postprocess.glsl';

export const postProcessShader = (width: number, height: number, device: string) => {
  const checkDevice = device === 'mobile' ? 1.0 : 0.0; //1.0 for mobile, 0.0 for desktop

  const config = {
    uniforms: {
      tDiffuse: { value: null },
      //-------色調の補正につかうパラメータ-------
      uGamma: { value: 1.54 },
      uOffset: { value: 0.5 },
      uDarkness: { value: 0.8 },
      //-------自作bloomエフェクトに使う-------
      uThreshold: { value: checkDevice == 1.0 ? 0.1 : 0.1 }, //閾値(現在、ほぼ全域)
      uStrength: { value: checkDevice == 1.0 ? 0.36 : 0.2 }, //bloom強度
      uRadius: { value: checkDevice == 1.0 ? 0.64 : 1.75 }, //bloom範囲
      //-------なんだかんだいつも必要なやつ--------
      uAspect: { value: width / height },
      uResolution: { value: { x: width, y: height } },
      //-------ローディング完了アニメーションにつかう-------
      uLoadingTransition: { value: 0 },
      uTime: { value: 0 },
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
