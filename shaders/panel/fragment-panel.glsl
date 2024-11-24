uniform float uAspect;
uniform float uTelopAspect;
uniform float uCount;
uniform float uTime;
uniform float uSpeed;
uniform float uVelocity;
uniform float uActivePage;
uniform sampler2D uTextures[10];
uniform sampler2D uNoiseTexture;
uniform sampler2D uTelopTexture;
uniform float uTextureAspectRatios[10];
uniform float uRowLengths[5];

const float PI = 3.14159265359;

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

  float activepage = floor(uActivePage);//ページ判定 0:top 1:about 2:gallery系

  //汎用ノイズ
  float noise = cnoise(vec3(vUv.y * 60.0, sin(uTime * 40.0), vUv.y));

  //各パネルを使用する場合のUV
  vec2 singleScreenUv = vUv;

   //全体で一つのパネルと捉えた際のUV
  float totalWidth = uCount * uAspect * 2.0;
  float totalHeight = uCount * 2.0;
  float x = (vWorldPosition.x + totalWidth * 0.5) / totalWidth;
  float y = (vWorldPosition.y) / totalHeight;
  vec2 fullScreenUv = vec2(x, y);

  //各パネルのアスペクト比を考慮したUV
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
  vec2 fullScreenOptimizedTelopUv = optimizationTextureUv(fullScreenUv, uAspect, uTelopAspect);
  // vec2 fullScreenOptimizedUv0 = optimizationTextureUv(fullScreenUv, uAspect, uTextureAspectRatios[0]);

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

  //各全体で一つのパネルとした場合のテクスチャを取得方法
  // vec4 fullScreenDiffuseColor0 = texture2D(uTextures[0], fullScreenOptimizedUv0);

  //top pageのテキストが流れるアニメーションに使用するテクスチャ出力
  vec2 scrollingUv = fullScreenOptimizedTelopUv;
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
  // vec3 noiseColor = vec3(0.0) + rand(fullScreenUv + mod(uTime, 1.0) + 24.0) * 0.7;
  noiseColor += step(0.0, sin(uTime * 0.51 - fullScreenUv.y) * sin(uTime * 0.56 - fullScreenUv.y * 1.0)) * 0.05;
  // noiseColor += step(0.0, sin(uTime * 0.51 - fullScreenUv.y) * sin(uTime * 0.56 - fullScreenUv.y * 1.0)) * 0.05;

  //画面切り替えの設定
  float totalDuration = 5.0;
  float transitionDuration = 0.01;
  float noiseDuration = 0.2;//これは切り替え時にノイズが出る時間の長さとなる

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

  //ノイズ強度の変遷
  float noiseIntensity;
  if(shouldShowNoise) {
    noiseIntensity = 1.0;
    if(normalizedCycle < noiseStartThreshold) {
    //表示中->次の画面 となるときのノイズ強度の変遷
      float t = normalizedCycle / noiseStartThreshold;

      noiseIntensity = 1.0 - t;
    } else if(normalizedCycle > noiseEndThreshold) {
      //次の画面の表示が完了->再生... となるときのノイズ強度の変遷
      float t = (normalizedCycle - noiseEndThreshold) / (1.0 - noiseEndThreshold);

      noiseIntensity = t;
    }
  }

  float transition = smoothstep(0.0, transitionDuration, normalizedCycle);//transitionDurationの時点で1.0になるから、その時点で切り替わるということ。
  float progress;

  if(EvenOdd == 0.0) {//fullscreen
    progress = transition;
  } else {//singlescreen
    progress = 1.0 - transition;
  }

  vec2 glitchOffset;
  if(shouldShowNoise) {
    glitchOffset = vec2(cnoise(vec3(vUv.y * 100.0, sin(uTime * 240.0), fullScreenUv.y)), 0.0) * noiseIntensity;
  }

  vec4 ProgressDiffuse;//サイクルによって切り替わる最終的な出力の土台

   //チェッカーボードのレイアウト
  vec4 checkerBoardDiffuseColor;
  vec4 diffuseForCheckerBoard;

  float index = floor(vIndex + 0.5);

  if(activepage == 0.0) {
    if(mod(index, 3.0) == 0.0) {
      diffuseForCheckerBoard = texture2D(uTextures[0], singleOptimizedUv0 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    } else if(mod(index, 3.0) == 1.0) {
      diffuseForCheckerBoard = texture2D(uTextures[1], singleOptimizedUv1 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    } else if(mod(index, 3.0) == 2.0) {
      diffuseForCheckerBoard = texture2D(uTextures[1], singleOptimizedUv1 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    }
  } else if(activepage == 1.0) {
    if(mod(index, 3.0) == 0.0) {
      diffuseForCheckerBoard = texture2D(uTextures[0], singleOptimizedUv0 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    } else if(mod(index, 3.0) == 1.0) {
      diffuseForCheckerBoard = texture2D(uTextures[1], singleOptimizedUv1 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    } else if(mod(index, 3.0) == 2.0) {
      diffuseForCheckerBoard = texture2D(uTextures[1], singleOptimizedUv1 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    }
  } else {
    if(mod(index, 10.0) == 0.0) {
      diffuseForCheckerBoard = texture2D(uTextures[0], singleOptimizedUv0 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    } else if(mod(index, 10.0) == 1.0) {
      diffuseForCheckerBoard = texture2D(uTextures[1], singleOptimizedUv1 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    } else if(mod(index, 10.0) == 2.0) {
      diffuseForCheckerBoard = texture2D(uTextures[2], singleOptimizedUv2 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    } else if(mod(index, 10.0) == 3.0) {
      diffuseForCheckerBoard = texture2D(uTextures[3], singleOptimizedUv3 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    } else if(mod(index, 10.0) == 4.0) {
      diffuseForCheckerBoard = texture2D(uTextures[4], singleOptimizedUv4 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    } else if(mod(index, 10.0) == 5.0) {
      diffuseForCheckerBoard = texture2D(uTextures[5], singleOptimizedUv5 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    } else if(mod(index, 10.0) == 6.0) {
      diffuseForCheckerBoard = texture2D(uTextures[6], singleOptimizedUv6 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    } else if(mod(index, 10.0) == 7.0) {
      diffuseForCheckerBoard = texture2D(uTextures[7], singleOptimizedUv7 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    } else if(mod(index, 10.0) == 8.0) {
      diffuseForCheckerBoard = texture2D(uTextures[8], singleOptimizedUv8 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    } else if(mod(index, 10.0) == 9.0) {
      diffuseForCheckerBoard = texture2D(uTextures[9], singleOptimizedUv9 + glitchOffset);

      checkerBoardDiffuseColor = diffuseForCheckerBoard;
    }
  }

  vec4 scrollingDiffuseColorNoise = texture2D(uTelopTexture, scrollingUv + glitchOffset);
  vec4 scrollingDiffuseColor = texture2D(uTelopTexture, scrollingUv);

  vec4 oddProgressDiffuse = scrollingDiffuseColorNoise;

  vec4 evenProgressDiffuse = checkerBoardDiffuseColor;

  if(activepage == 0.0) {
    ProgressDiffuse = mix(evenProgressDiffuse, oddProgressDiffuse, progress);
  } else if(activepage == 1.0) {
    ProgressDiffuse = scrollingDiffuseColor;
  } else {
    ProgressDiffuse = checkerBoardDiffuseColor;
  }

  //----------------test------------
  // ProgressDiffuse = checkerBoardDiffuseColor;
  // ProgressDiffuse = scrollingDiffuseColor;
  //----------------test------------

  vec4 finalColor = ProgressDiffuse;

  //最終的な色調整
  colorIntensity = 0.6 + 0.2 * pow(uVelocity, 3.0) + 0.01 * abs(sin(uTime * noise));//明度の4調節用

  finalColor.rgb *= colorIntensity;

  vec3 color = finalColor.rgb;

  // 点滅
  color *= step(0.0, sin(vUv.y * 5.0 - uTime * 2.0 * noise)) * 0.05 + 0.95;

  //走査線（画面全体）
  color *= step(0.0, sin(fullScreenUv.y * 4.0 - uTime * 0.9)) * 0.05 + 1.98;

	// 走査線（シングル）
  color *= 0.78 - sin(fullScreenUv.y * 200.0 - uTime * 100.0) * 0.01;

	// ヴィネット
  if(EvenOdd == 0.0) {
    color *= smoothstep(1.0, 0.3, length(fullScreenUv - 0.5));
  } else {
    color *= smoothstep(1.0, 0.3, length(singleScreenUv - 0.5));
  }

  //画面切り替え時のノイズの表示
  if(activepage == 0.0) {
    if(shouldShowNoise) {
      color = mix(color, noiseColor, noiseIntensity); // ノイズの強度を調整（0.8は調整可能）
    };
  }

  gl_FragColor = vec4(color, finalColor.a);
}