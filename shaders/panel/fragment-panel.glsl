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

  // vec2 n = vec2((texture2D(uNoiseTex, vec2(vUv.y * 2.0, uTime * 3.0)).xy - 0.5) * 0.5);
  // n *= vFade;
  // n.x -= (texture2D(uNoiseTex, vec2(vUv.y * 50.0, uTime * 3.0)).x - 0.5) * 0.05;

  // vec2 singleScreenUvR = singleScreenUv + n;
  // vec2 singleScreenUvG = singleScreenUv + n * 0.5;
  // vec2 singleScreenUvB = singleScreenUv + n * 1.0;

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

  //top pageのテキストが流れるアニメーションに使用するテクスチャ出力
  vec2 scrollingUv = fullScreenOptimizedUv0;
  int row = int(floor(scrollingUv.y * 5.0));//テクスチャは5行に分かれたテキストであるため。
  float speed = uSpeed * (1.0 / uRowLengths[row]);//各行にふさわしいスピードを設定
  float scrollingOffset = fract(uTime * speed);
  scrollingUv.x = fract((scrollingUv.x + scrollingOffset));
  float rowLength = uRowLengths[row];
  float compressdX = scrollingUv.x * rowLength;//各行の空白部分はサンプリングしないので、その部分を圧縮
  scrollingUv.x = mod(compressdX + scrollingOffset, rowLength);//圧縮した部分を元に戻す。例えば、0.7の幅だとしたら、0.7の長さが1.0の長さになるようにする。（自分用のメモです）
  // vec4 scrollingDiffuseColor = texture2D(uTextures[0], scrollingUv);//glitchでサンプリングをずらすため、diffuseの決定は後述にまわす

  //ノイズ画面
  vec3 noiseColor = vec3(0.0) + rand(fullScreenUv + mod(uTime, 1.0) + 24.0) * 0.7;
  noiseColor += step(0.0, sin(uTime * 0.51 - fullScreenUv.y) * sin(uTime * 0.56 - fullScreenUv.y * 1.0)) * 0.05;

  //画面切り替えの設定
  float totalDuration = 6.0;
  float noiseDuration = 0.1;
  float transitionDuration = 0.02;//これは切り替え時にノイズが出る時間の長さとなる

  //切り替えのサイクルを設定
  float cycle = mod(uTime, totalDuration);//0.0 ～ totalDurationを繰り返す
  float normalizedCycle = cycle / totalDuration;//0.0 ～ 1.0に正規化

  //切り替え時にノイズを表示する期間の設定
  float noiseStartThreshold = noiseDuration / totalDuration; // 0.2/4.0=0.05
  float noiseEndThreshold = 1.0 - noiseStartThreshold; // 3.8/4.0 = 0.95

  //ノイズ表示の判定に使用する
  bool shouldShowNoise = normalizedCycle < noiseStartThreshold || normalizedCycle > noiseEndThreshold;

  //サイクルの偶数奇数の判別に使う
  float EvenOdd = mod(floor(uTime / totalDuration), 2.0);

  float noiseIntensity;
  if(shouldShowNoise) {
    noiseIntensity = 1.0;

    if(normalizedCycle < noiseStartThreshold) {
      float t = normalizedCycle / noiseStartThreshold;

      noiseIntensity = 1.0 - t;
    } else if(normalizedCycle > noiseEndThreshold) {
      float t = (normalizedCycle - noiseEndThreshold) / (1.0 - noiseEndThreshold);

      noiseIntensity = t;
    }
  }

  float transition = smoothstep(0.0, transitionDuration, normalizedCycle);//transitionDurationの時点で1.0になるから、その時点で切り替わる
  float progress;

  if(EvenOdd == 0.0) {//fullscreen
    progress = transition;
  } else {//singlescreen
    progress = 1.0 - transition;
  }

  vec2 glitchOffset;
  if(shouldShowNoise) {
    glitchOffset = vec2(cnoise(vec3(vUv.y, uTime * 0.1, 1.0)), 0.0) * noiseIntensity;
  }

  vec4 ProgressDiffuse;//サイクルによって切り替わる最終的な出力の土台

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

  ProgressDiffuse = mix(evenProgressDiffuse, oddProgressDiffuse, progress);

  //vUndexの色デバッグ用
  // color = vec3(vIndex / (uCount * uCount), 0.0, 0.0);
  // color = vec3(vIndex / 50.0, vIndex / 50.0, vIndex / 50.0);
  vec4 finalColor = ProgressDiffuse;

  //最終的な色調整
  colorIntensity = 0.4 + 0.6 * uVelocity;//明度の4調節用

  finalColor.rgb *= colorIntensity;

  vec3 color = finalColor.rgb;

  // 点滅
  color *= step(0.0, sin(vUv.y * 5.0 - uTime * 80.0)) * 0.05 + 0.95;

	// 走査線（太）
  color *= 0.78 - sin(fullScreenUv.y * 200.0 - uTime * 10.0) * 0.02;

	// ヴィネット
  if(EvenOdd == 0.0) {
    color *= smoothstep(1.0, 0.3, length(fullScreenUv - 0.5));
  } else {
    color *= smoothstep(1.0, 0.3, length(singleScreenUv - 0.5));
  }

  //画面切り替え時のノイズの表示
  if(shouldShowNoise) {
    color = mix(color, noiseColor, noiseIntensity); // ノイズの強度を調整（0.8は調整可能）
  };

  gl_FragColor = vec4(color, finalColor.a);
}