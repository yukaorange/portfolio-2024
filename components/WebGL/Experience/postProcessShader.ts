import postprocessShader from '@/shaders/postprocess/fragment-postprocess.glsl';

export const postProcessShader = (widdh: number, height: number, device: string) => {
  const checkDevice = device === 'mobile' ? 1.0 : 0.0; //1.0 for mobile, 0.0 for desktop

  const config = {
    uniforms: {
      tDiffuse: { value: null },
      uGamma: { value: 1.3 },
      uOffset: { value: 0.5 },
      uDarkness: { value: 0.8 },
      uThreshold: { value: checkDevice == 1.0 ? 0.1 : 0.2 }, //閾値(現在、ほぼ全域)
      uStrength: { value: checkDevice == 1.0 ? 0.15 : 0.165 }, //bloom強度
      uRadius: { value: checkDevice == 1.0 ? 1.98 : 1.4 }, //bloom範囲
      uAspect: { value: widdh / height },
      uResolution: { value: { x: widdh, y: height } },
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
