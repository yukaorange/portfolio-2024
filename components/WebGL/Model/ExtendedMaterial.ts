import { extend } from '@react-three/fiber';
import * as THREE from 'three';

class ExtendedMaterial extends THREE.MeshStandardMaterial {
  constructor(parameters: THREE.MeshStandardMaterialParameters = {}) {
    super(parameters);

    this.transparent = true;
    this.depthWrite = false;

    this.onBeforeCompile = (shader) => {
      this.userData.shader = shader;

      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uBoundsMin = { value: new THREE.Vector3() };
      shader.uniforms.uBoundsMax = { value: new THREE.Vector3() };
      shader.uniforms.uEffectProgress = { value: 0.0 };

      //----------vertexShader----------
      const additionalVertexVaryings = /* glsl */ `
      //-------uniforms-------
      uniform float uTime;
      uniform vec3 uBoundsMin;
      uniform vec3 uBoundsMax;
      uniform float uEffectProgress;
      //-------varyings-------
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;
      //-------functions-------
      float calcReMap(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {
        if(clamp == true) {
            if(value < inputMin) return outputMin;
            if(value > inputMax) return outputMax;
        }
        float p = (outputMax - outputMin) / (inputMax - inputMin);
        return ((value - inputMin) * p) + outputMin;
      }
      float snoise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      float random2D(vec2 value){
        return fract(sin(dot(value, vec2(12.9898, 78.233))) * 43758.5453);
      }
      `;
      const additionalVertexOutPut = /* glsl */ `
      //----------projectVertexのソースコードを拝借----------
      // vec4 mvPosition = vec4( transformed, 1.0 );
      vec4 mvPosition;

      //-----------glitch-----------
      //y方向で差を設ける
      vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
      
      float worldHeight = (worldPosition.y - uBoundsMin.y) / (uBoundsMax.y - uBoundsMin.y);
      
      float glitchTime = uTime * 10.0;
      
      float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.4) + sin(glitchTime * 8.7);

      glitchStrength *= 0.065;//強度を調整
      glitchStrength *= uEffectProgress;//進行度に応じて適用していく

      float glitchRandom = random2D(worldPosition.xz + uTime);//0 - 1のランダム値

      worldPosition.x += (glitchRandom - 0.5) *  glitchStrength;//0.5を引くことで、ランダム値の範囲を-0.5~0.5にする
      // worldPosition.z += (random2D(worldPosition.xz + uTime) - 0.5) *  glitchStrength;
      
      // worldPosition.z += (random2D(worldPosition.zx + uTime) - 0.5) * glitchStrength;     
      
      // #ifdef USE_BATCHING
      
      // mvPosition = batchingMatrix * mvPosition;
      
      // #endif
      
      // #ifdef USE_INSTANCING
      
      // mvPosition = instanceMatrix * mvPosition;
      
      // #endif
      
      mvPosition = viewMatrix * worldPosition;
      
      gl_Position = projectionMatrix * mvPosition;
      
      //---------バイリング送信--------------
      vWorldPosition = worldPosition.xyz;
      vWorldNormal = normalize(normalMatrix * normal);
      `;

      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${additionalVertexVaryings}`)
        .replace('#include <project_vertex>', `\n${additionalVertexOutPut}`);

      //----------fragmentShader----------
      const additionalFragmentVaryings = /* glsl */ `
      //-------uniforms-------
      uniform float uTime;
      uniform vec3 uBoundsMin;
      uniform vec3 uBoundsMax;
      uniform float uEffectProgress;
      //-------varyings-------
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      //-------functions-------
      float calcReMap(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {
        if(clamp == true) {
            if(value < inputMin) return outputMin;
            if(value > inputMax) return outputMax;
        }
        float p = (outputMax - outputMin) / (inputMax - inputMin);
        return ((value - inputMin) * p) + outputMin;
      }
      float snoise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      `;
      const additionalFragmentColor = /* glsl */ `
      //ノーマライズされた高さ（原点->モデルの頭部頂点 : 0 -> 1）
      float worldHeight = (vWorldPosition.y - uBoundsMin.y) / (uBoundsMax.y - uBoundsMin.y);
      
      //モデルを縦方向に分割
      float partitionValue = 7.0;//7分割
      float section = floor(worldHeight * partitionValue);
      float part = section / partitionValue;

      //----------ユーティリティ---------

      //横方向のストライプ

      float stripes = mod(vWorldPosition.y * 100.0 + uTime, 1.0);
      stripes = pow(stripes, 20.0);//濃淡の変化を急激にする

      float holographic = stripes; 

      float timeBlock = floor(uTime * 10.0);


      float waveNoise = sin(worldHeight * 50.0 + timeBlock) * 0.02;
      float adjustedHeight = worldHeight + waveNoise;

      vec2 noiseCoord = vWorldPosition.xy * 0.1;
      float n1 = snoise(floor(noiseCoord * vec2(adjustedHeight, section) * vec2(4.0, 5.0) + uTime) * 0.5 + 0.5);
      float n2 = snoise(noiseCoord * floor(vec2(adjustedHeight, section) * vec2(5.0, 6.0) + uTime) * 0.5 + 0.5);
      float n3 = snoise(noiseCoord * floor(vec2(adjustedHeight, section) * vec2(6.0, 4.0) + uTime) * 0.5 + 0.5);
      float n = smoothstep(0.4, 0.5, n1 + n2 + n3);


      //------------エフェクト色-----------
      float hue = part + uTime*10.0;

      hue = fract(hue);//0~0.9999...
      hue = mix(0.6, 0.9, hue);//hueの範囲を制限

      vec3 effectColor;
      
      effectColor = hsv2rgb(vec3(hue, mix(0.64,0.98,n), mix(0.01,0.2,n)));//色相、彩度、明度 (彩度と明度がランダムになることを狙っている) 

      //----------エフェクト-----------
      //進行度の準備
      //1以上までリマップで広げているのは、最終的に進行度が1になったときに全域をカバーできるから。
      float progress = uEffectProgress;
      float phase1Progress = calcReMap(progress,0.0,0.4,0.0,1.2,true);
      float phase2Progress = calcReMap(progress,0.4,1.0,0.0,1.2,true);

      // 消失エフェクト進行（下から上へ）
      float firstPhase = smoothstep(worldHeight , worldHeight + 0.1, phase1Progress);
      float secondPhase = smoothstep(worldHeight, worldHeight + 0.1, phase2Progress);
      
      vec4 finalColor = vec4(gl_FragColor.rgb,gl_FragColor.a);

      finalColor = mix(finalColor,vec4(effectColor,1.0), firstPhase);
      finalColor = mix(finalColor,vec4(0.0,0.0,0.0,0.0), secondPhase);

      finalColor.a = mix(1.0,stripes,firstPhase);
      finalColor.a = mix(finalColor.a,0.0,secondPhase);

      if(finalColor.a < 0.01) discard;//透明度が0.01以下の場合は描画しない（消失したと見なす）

      // finalColor.rgb = vec3(holographic);

      gl_FragColor = finalColor;
      `;

      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\n${additionalFragmentVaryings}`)
        .replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>\n${additionalFragmentColor}`
        );

      //マテリアルの中身を確認
      // console.log('確認 vertex : ' + shader.vertexShader);
      // console.log('確認 fragment : ' + shader.fragmentShader);
    };
  }

  update(time: number, progress: number, bounds: THREE.Box3) {
    if (this.userData.shader) {
      this.userData.shader.uniforms.uTime.value = time;

      this.userData.shader.uniforms.uEffectProgress.value = progress;

      this.userData.shader.uniforms.uBoundsMin.value.copy(bounds.min);

      this.userData.shader.uniforms.uBoundsMax.value.copy(bounds.max);
    }
  }
}

extend({ ExtendedMaterial });

export { ExtendedMaterial };
