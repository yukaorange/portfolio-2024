uniform float uAspect;
uniform float uCount;
uniform float uTime;
uniform float uSpeed;
uniform float uVelocity;
uniform sampler2D uTextures[10];
uniform float uTextureAspectRatios[10];
uniform float uRowLengths[5];

varying float vIndex;//1 ～ count * count
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vInstacePosition;

#pragma glslify: optimizationTextureUv = require('../utils/optimizeUv.glsl');
#pragma glslify: cnoise = require('../utils/noise.glsl');
#pragma glslify: rand = require('../utils/random.glsl');

void main() {
  float colorIntensity;//明度の調節用

  //各パネルを使用する場合のUV
  vec2 singleScreenUv = vUv;

  //全体で一つのパネルと捉えた際のUV
  float totalWidth = uCount * uAspect * 2.0;
  float totalHeight = uCount * 2.0;
  float x = (vWorldPosition.x + totalWidth * 0.5) / totalWidth;
  float y = (vWorldPosition.y) / totalHeight;
  vec2 fullScreenUv = vec2(x, y);
  //全各パネルのアスペクト比を考慮したUV
  vec2 singleOptimizedUv0 = optimizationTextureUv(singleScreenUv, uAspect, uTextureAspectRatios[0]);
  vec2 singleOptimizedUv1 = optimizationTextureUv(singleScreenUv, uAspect, uTextureAspectRatios[1]);
  vec2 singleOptimizedUv2 = optimizationTextureUv(singleScreenUv, uAspect, uTextureAspectRatios[2]);
  vec2 singleOptimizedUv3 = optimizationTextureUv(singleScreenUv, uAspect, uTextureAspectRatios[3]);
  vec2 singleOptimizedUv4 = optimizationTextureUv(singleScreenUv, uAspect, uTextureAspectRatios[4]);
  vec2 singleOptimizedUv5 = optimizationTextureUv(singleScreenUv, uAspect, uTextureAspectRatios[5]);
  vec2 singleOptimizedUv6 = optimizationTextureUv(singleScreenUv, uAspect, uTextureAspectRatios[6]);
  vec2 singleOptimizedUv7 = optimizationTextureUv(singleScreenUv, uAspect, uTextureAspectRatios[7]);
  vec2 singleOptimizedUv8 = optimizationTextureUv(singleScreenUv, uAspect, uTextureAspectRatios[8]);
  vec2 singleOptimizedUv9 = optimizationTextureUv(singleScreenUv, uAspect, uTextureAspectRatios[9]);
  //全体で一つのパネルと捉えた際のテクスチャのアスペクト比を考慮したUV
  vec2 fullScreenOptimizedUv0 = optimizationTextureUv(fullScreenUv, uAspect, uTextureAspectRatios[0]);
  vec2 fullScreenOptimizedUv1 = optimizationTextureUv(fullScreenUv, uAspect, uTextureAspectRatios[1]);
  vec2 fullScreenOptimizedUv2 = optimizationTextureUv(fullScreenUv, uAspect, uTextureAspectRatios[2]);
  vec2 fullScreenOptimizedUv3 = optimizationTextureUv(fullScreenUv, uAspect, uTextureAspectRatios[3]);
  vec2 fullScreenOptimizedUv4 = optimizationTextureUv(fullScreenUv, uAspect, uTextureAspectRatios[4]);
  vec2 fullScreenOptimizedUv5 = optimizationTextureUv(fullScreenUv, uAspect, uTextureAspectRatios[5]);
  vec2 fullScreenOptimizedUv6 = optimizationTextureUv(fullScreenUv, uAspect, uTextureAspectRatios[6]);
  vec2 fullScreenOptimizedUv7 = optimizationTextureUv(fullScreenUv, uAspect, uTextureAspectRatios[7]);
  vec2 fullScreenOptimizedUv8 = optimizationTextureUv(fullScreenUv, uAspect, uTextureAspectRatios[8]);
  vec2 fullScreenOptimizedUv9 = optimizationTextureUv(fullScreenUv, uAspect, uTextureAspectRatios[9]);
 //各パネルを使用する場合のテクスチャを取得
  vec4 singleDiffuseColor0 = texture2D(uTextures[0], singleOptimizedUv0);
  vec4 singleDiffuseColor1 = texture2D(uTextures[1], singleOptimizedUv1);
  vec4 singleDiffuseColor2 = texture2D(uTextures[2], singleOptimizedUv2);
  vec4 singleDiffuseColor3 = texture2D(uTextures[3], singleOptimizedUv3);
  vec4 singleDiffuseColor4 = texture2D(uTextures[4], singleOptimizedUv4);
  vec4 singleDiffuseColor5 = texture2D(uTextures[5], singleOptimizedUv5);
  vec4 singleDiffuseColor6 = texture2D(uTextures[6], singleOptimizedUv6);
  vec4 singleDiffuseColor7 = texture2D(uTextures[7], singleOptimizedUv7);
  vec4 singleDiffuseColor8 = texture2D(uTextures[8], singleOptimizedUv8);
  vec4 singleDiffuseColor9 = texture2D(uTextures[9], singleOptimizedUv9);

  //各全体で一つのパネルとした場合のテクスチャを取得
  vec4 fullScreenDiffuseColor0 = texture2D(uTextures[0], fullScreenOptimizedUv0);
  vec4 fullScreenDiffuseColor1 = texture2D(uTextures[1], fullScreenOptimizedUv1);
  vec4 fullScreenDiffuseColor2 = texture2D(uTextures[2], fullScreenOptimizedUv2);
  vec4 fullScreenDiffuseColor3 = texture2D(uTextures[3], fullScreenOptimizedUv3);
  vec4 fullScreenDiffuseColor4 = texture2D(uTextures[4], fullScreenOptimizedUv4);
  vec4 fullScreenDiffuseColor5 = texture2D(uTextures[5], fullScreenOptimizedUv5);
  vec4 fullScreenDiffuseColor6 = texture2D(uTextures[6], fullScreenOptimizedUv6);
  vec4 fullScreenDiffuseColor7 = texture2D(uTextures[7], fullScreenOptimizedUv7);
  vec4 fullScreenDiffuseColor8 = texture2D(uTextures[8], fullScreenOptimizedUv8);
  vec4 fullScreenDiffuseColor9 = texture2D(uTextures[9], fullScreenOptimizedUv9);

  //top pageのテキストが流れるアニメーションに使用
  vec2 scrollingUv = fullScreenOptimizedUv0;
  int row = int(floor(scrollingUv.y * 5.0));//テクスチャは5行に分かれたテキストであるため。
  float speed = uSpeed * (1.0 / uRowLengths[row]);//各行にふさわしいスピードを設定
  float scrollingOffset = fract(uTime * speed);
  scrollingUv.x = fract((scrollingUv.x + scrollingOffset));
  float rowLength = uRowLengths[row];
  float compressdX = scrollingUv.x * rowLength;//各行の空白部分はサンプリングしないので、その部分を圧縮
  scrollingUv.x = mod(compressdX + scrollingOffset, rowLength);//圧縮した部分を元に戻す。例えば、0.7の幅だとしたら、0.7の長さが1.0の長さになるようにする。（自分用のメモです）
  // vec4 scrollingDiffuseColor = texture2D(uTextures[0], scrollingUv);//glitchでサンプリングをずらすために、後述

  float totalDuration = 8.0;
  float transitionDuration = 0.1;

  float cycle = floor(uTime / totalDuration);
  float t = mod(uTime, totalDuration);//0.0 ～ totalDurationを繰り返す

  float progress;

  float transition = smoothstep(0.0, transitionDuration, t);//transitionDurationの時点で1.0になるから、その時点で切り替わる

  if(mod(cycle, 2.0) == 0.0) {
    progress = transition;
  } else {
    progress = 1.0 - transition;
  }

  vec4 glitchProgressDiffuse;
  float glitchProgressIntensity = smoothstep(0.0, transitionDuration, t) *
    (1.0 - smoothstep(transitionDuration, totalDuration, t));
  vec2 glitchOffset = vec2(rand(vec2(vUv.y, uTime)) * 2.0 - 1.0, rand(vec2(vUv.x, uTime)) * 2.0 - 1.0) * 0.03 * glitchProgressIntensity;

   //チェッカーボードのレイアウトにするなら、使える。
  vec4 checkerBoardDiffuseColor;
  if(mod(floor(vIndex + 0.5), 2.0) == 1.0) {
    vec4 diffuseForCheckerBoardOdd = texture2D(uTextures[0], singleOptimizedUv0 + glitchOffset);
    checkerBoardDiffuseColor = diffuseForCheckerBoardOdd;
  } else {
    vec4 diffuseForCheckerBoardEven = texture2D(uTextures[1], singleOptimizedUv1 + glitchOffset);
    checkerBoardDiffuseColor = diffuseForCheckerBoardEven;
  }

  vec4 scrollingDiffuseColor = texture2D(uTextures[0], scrollingUv + glitchOffset);

  vec4 oddProgressDiffuse = scrollingDiffuseColor;
  vec4 evenProgressDiffuse = checkerBoardDiffuseColor;

  glitchProgressDiffuse = mix(evenProgressDiffuse, oddProgressDiffuse, progress);

  //vUndexの色デバッグ用
  // color = vec3(vIndex / (uCount * uCount), 0.0, 0.0);
  // color = vec3(vIndex / 50.0, vIndex / 50.0, vIndex / 50.0);
  vec4 finalColor = glitchProgressDiffuse;

  //最終的な色調整
  colorIntensity = 0.13 + 0.2 * uVelocity;//明度の調節用
  finalColor.rgb *= colorIntensity;

  vec3 color = finalColor.rgb;
  // ビカビカ
  color *= step(0.0, sin(vUv.y * 5.0 - uTime * 80.0)) * 0.05 + 0.95;
  	// 反転
  // color = mix(color, 1.0 - color, vInvert);

	// なみなみ
  color *= 0.78 - sin(vUv.y * 200.0 - uTime * 10.0) * 0.02;

	// 周辺減光的な
  color *= smoothstep(1.0, 0.3, length(vUv - 0.5));

  gl_FragColor = vec4(color, finalColor.a);

}