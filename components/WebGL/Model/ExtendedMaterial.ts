import * as THREE from 'three';
import { extend } from '@react-three/fiber';

class ExtendedMaterial extends THREE.MeshStandardMaterial {
  constructor(parameters: THREE.MeshStandardMaterialParameters = {}) {
    super(parameters);

    this.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };

      const additionalVertexShaderAtCommon = /* glsl */ `
      #include <common>
      uniform float uTime;
      `;

      shader.vertexShader = shader.vertexShader.replace(
        /* glsl */
        '#include <common>',
        additionalVertexShaderAtCommon
      );
      // shader.vertexShader = shader.vertexShader.replace(
      //   /* glsl */
      //   '#include <common>',
      //   additionalVertexShaderAtCommon
      // );

      const additionalFragmentShader = /* glsl */ `
      #include <dithering_fragment>
      `;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        additionalFragmentShader
      );
    };
  }
}

extend({ ExtendedMaterial });

export { ExtendedMaterial };
