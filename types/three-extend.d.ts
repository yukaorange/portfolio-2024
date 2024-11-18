import * as THREE from 'three';

declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  import { WebGLRenderer, WebGLRenderTarget } from 'three';

  export class EffectComposer {
    constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget);
    addPass(pass: any): void;
    insertPass(pass: any, index: number): void;
    removePass(pass: any): void;
    render(deltaTime?: number): void;
    reset(renderTarget?: WebGLRenderTarget): void;
    setSize(width: number, height: number): void;
    setPixelRatio(pixelRatio: number): void;
  }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
  import { Scene, Camera } from 'three';

  export class RenderPass {
    constructor(
      scene: Scene,
      camera: Camera,
      overrideMaterial?: THREE.Material,
      clearColor?: THREE.Color,
      clearAlpha?: number
    );
    scene: Scene;
    camera: Camera;
    enabled: boolean;
    clear: boolean;
    needsSwap: boolean;
    clearDepth: boolean;
    renderToScreen: boolean;
  }
}

declare module 'three/examples/jsm/postprocessing/SMAAPass' {
  import { WebGLRenderer } from 'three';

  export class SMAAPass {
    constructor(width: number, height: number);
    edgesRT: THREE.WebGLRenderTarget;
    weightsRT: THREE.WebGLRenderTarget;
    areaTexture: THREE.Texture;
    searchTexture: THREE.Texture;
    uniformsEdges: { [uniform: string]: THREE.IUniform };
    uniformsWeights: { [uniform: string]: THREE.IUniform };
    materialEdges: THREE.ShaderMaterial;
    materialWeights: THREE.ShaderMaterial;
    materialBlend: THREE.ShaderMaterial;
    fsQuad: THREE.FullScreenQuad;
    enabled: boolean;
    needsSwap: boolean;
    setSize(width: number, height: number): void;
    render(
      renderer: WebGLRenderer,
      writeBuffer: THREE.WebGLRenderTarget,
      readBuffer: THREE.WebGLRenderTarget,
      deltaTime: number,
      maskActive: boolean
    ): void;
  }
}
