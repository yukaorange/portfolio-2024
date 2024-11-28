import postprocessShader from '@/shaders/postprocess/fragment-postprocess.glsl';

export const postProcessShader = (widdh: number, height: number, device: string) => {
  const checkDevice = device === 'mobile' ? 1.0 : 0.0; //1.0 for mobile, 0.0 for desktop

  const config = {
    uniforms: {
      tDiffuse: { value: null },
      uGamma: { value: 1.08 },
      uOffset: { value: 0.5 },
      uDarkness: { value: 0.8 },
      uThreshold: { value: checkDevice == 1.0 ? 0.1 : 0.1 }, //閾値(現在、ほぼ全域)
      uStrength: { value: checkDevice == 1.0 ? 0.25 : 0.33 }, //bloom
      uRadius: { value: checkDevice == 1.0 ? 2.2 : 1.1 }, //bloom
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
