uniform float uAspect;
uniform float uTelopAspect;
uniform float uCount;
uniform float uTime;
uniform float uTransition;
uniform float uIsTransitioning;
uniform float uSpeed;
uniform float uCurrentIndex;
uniform float uNextIndex;
uniform float uIndexTransition;
uniform float uActivePage;
uniform float uLoaded;
uniform float uIsGallerySection;
uniform float uIsScrollEnd;
uniform float uDevice;
uniform sampler2D uTextures[10];
uniform sampler2D uTelopTexture;
uniform float uTextureAspectRatios[10];
uniform float uRowLengths[5];
// uniform vec2 uResolution;

const float PI = 3.14159265359;

varying float vIndex;//1 ～ count * count
varying float vInvert;
varying vec2 vUv;
varying vec3 vWorldPosition;

#pragma glslify: optimizationTextureUv = require('../utils/optimizeUv.glsl');
#pragma glslify: hash = require('../utils/hash.glsl');
#pragma glslify: snoise = require('../utils/snoise.glsl');
#pragma glslify: wave = require('../utils/wave.glsl');
#pragma glslify: stripe = require('../utils/stripe.glsl');
#pragma glslify: cardiogram = require('../utils/electrocardiogram.glsl');
#pragma glslify: createGrid = require('../utils/grid.glsl');
#pragma glslify: blendOverlay = require('../utils/blend.glsl');
#pragma glslify: dotPattern = require('../utils/dotPattern.glsl');
#pragma glslify: grayScale = require('../utils/grayScale.glsl');
#pragma glslify: map = require('../utils/map.glsl');
#pragma glslify: pixelTransition = require('../utils/pixelTransition.glsl');
#pragma glslify: gridTransition = require('../utils/gridTransition.glsl');
#pragma glslify: easeInQuart = require('../utils/easing.glsl');

void main() {

  //----------テクスチャサンプル ----------

  vec3 testcolor; //test
  vec4 testDissuse = vec4(0.0);

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

  // vec2 singleScreenOptimizedTelopUv = optimizationTextureUv(singleScreenUv, uAspect, uTelopAspect);

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

 //各パネルを使用する場合のテクスチャを取得する場合
  // vec4 singleDiffuseColor0 = texture2D(uTextures[0], singleOptimizedUv0);

  //各全体で一つのパネルとした場合のテクスチャを取得する場合
  // vec4 fullScreenDiffuseColor0 = texture2D(uTextures[0], fullScreenOptimizedUv0);

  //------------グリッドパネル関連のプロパティ-------------

  vec2 gridPos = vec2(mod(vIndex, uCount), floor(vIndex / uCount));

  vec2 center = vec2(floor((uCount / 2.0) - 2.0), floor(uCount / 2.0));//中心から少しずらしてます

  float distanceFromCenter = length(gridPos - center);

  float randomOffset = hash(vIndex + 42.0) * 1.0;

  float adjustedDistance = vIndex == 24.0 ? distanceFromCenter : distanceFromCenter + randomOffset;

  //-----------------テロップ画像のサンプリング準備など-----------------

  //テキストが流れるアニメーションに使用するテクスチャ出力
  vec2 scrollingUv = fullScreenOptimizedTelopUv;

  int row = int(floor(scrollingUv.y * 5.0));//テクスチャは5行に分かれたテキストであるため。
  float speed = uSpeed * (1.0 / uRowLengths[row]);//各行にふさわしいスピードを設定
  float rowLength = uRowLengths[row];

  float scrollingOffset = fract(uTime * 1.0 * speed);

  scrollingUv.x = fract((scrollingUv.x + scrollingOffset));

  float compressdX = scrollingUv.x * rowLength;//各行の空白部分はサンプリングしないので、その部分を圧縮

  scrollingUv.x = mod(compressdX + scrollingOffset, rowLength);//圧縮した部分を元に戻す。例えば、0.7の幅だとしたら、0.7の長さが1.0の長さになるようにする。（自分用のメモです）

  vec4 scrollingDiffuseColor = texture2D(uTelopTexture, scrollingUv);

  vec3 scrollingDiffuseColorGray = grayScale(scrollingDiffuseColor.rgb);

  scrollingDiffuseColor.rgb = mix(scrollingDiffuseColor.rgb, scrollingDiffuseColorGray, 0.4);

  scrollingDiffuseColor.rgb *= 0.1;

  //glitchでサンプリングをずらすため、FV用のdiffuseは下記テロップ画像アニメーション内でサンプリング

  //----------ユーティリティ-----------

  float colorIntensity;//明度の調節用

  float activepage = floor(uActivePage);//ページ判定 0:top 1:about 2:gallery系

  //hash値
  float hashValue = hash(singleScreenUv + mod(uTime, 1.0) + 214.0) * 0.7;

  //汎用ノイズ
  float noise = snoise(vec2(vUv.y * 60.0, sin(uTime * 40.0)));

  //invert
  float invert = vInvert;

  //shiverring
  float shiveringIntensity;

  if(uDevice == 1.0) {
    shiveringIntensity = 0.012;
  } else {
    shiveringIntensity = 0.006;
  }

  float shivering = sin(singleScreenUv.y * 1500.0 + sin(singleScreenUv.y * 10.0)) * noise * shiveringIntensity;

  // ---------- 汎用画像 ----------

  //汎用 ノイズ画面
  vec3 noiseColor = vec3(hashValue * hashValue);//ベースとなる砂嵐
  noiseColor *= 0.3;

  //汎用 等高線画面
  vec4 waveColor;

  float waveIntensity = wave(singleScreenUv.x, singleScreenUv.y) + 2.0;

  waveIntensity *= 1.23 * abs(sin(PI / 2.0 + uTime * 0.2) + 1.5);

  float waveDiffuse = fract(waveIntensity);

  if(mod(waveIntensity, 2.0) > 1.0) {
    waveDiffuse = 1.0 - waveDiffuse;
  }

  waveDiffuse = waveDiffuse / fwidth(waveIntensity);

  waveDiffuse = clamp(waveDiffuse, 0.0, 0.5);

  waveColor = vec4(vec3(waveDiffuse), 1.0);

  //汎用 心電図画面
  vec4 cardiogramColor = vec4(cardiogram(singleScreenUv, vec2(4.0, 3.0), uTime), 1.0);

  //グリッド線画面(主にaboutページ用)
  vec4 gridColor = vec4(createGrid(fullScreenUv, vec2(12.0, 9.0), uTime), 1.0);

  vec4 gridColorSingle = vec4(createGrid(singleScreenUv, vec2(2.0, 1.5), uTime * 3.0), 1.0);

  //矢印ストライプ画面
  vec4 arrowStripeColor;
  vec4 fullScreenArrowStripeColor;

  vec2 arrowStripeUv = singleScreenUv;
  vec2 fullScreenArrowStripeUv = fullScreenUv;

  arrowStripeUv.x -= uTime * 0.1;
  fullScreenArrowStripeUv.x -= uTime * 0.06;

  float arrowStripeValue = stripe(arrowStripeUv, 0.1);
  float fullScreenArrowStripeValue = stripe(fullScreenArrowStripeUv, 0.1);

  arrowStripeColor = vec4(vec3(arrowStripeValue), 1.0);
  fullScreenArrowStripeColor = vec4(vec3(fullScreenArrowStripeValue), 1.0);

  arrowStripeColor.rgb *= 0.4;

  //--------画面切替えアニメーション---------

  //画面切り替えの設定
  float totalDuration = 5.0;
  float noiseDuration = 0.25;//これは切り替え時にノイズが出る間の長さとなる
  float transitionDuration = 0.02;

  float changeStep = 4.0 * floor(uTime / (totalDuration * 1.0));

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

  float transition;
  transition = smoothstep(0.0, transitionDuration, normalizedCycle);//transitionDurationの時点で1.0になるから、その時点で切り替わるということ。

  // float delayOffset = adjustedDistance * 0.012;//目視で調整
  float delayOffset = adjustedDistance * 0.01;//目視で調整

  float delayedTransition = smoothstep(0.0 + delayOffset, transitionDuration + delayOffset, normalizedCycle);//delayを書ける場合はこっちを使う

  transition = delayedTransition;

  float progress;

  if(EvenOdd == 0.0) {//fullscreen
    progress = transition;
  } else {//singlescreen
    progress = 1.0 - transition;
  }

  //--------サンプリング用のノイズ-------
  vec2 glitchOffset;
  if(shouldShowNoise) {
    glitchOffset = vec2(0.0, mod(uTime * 3.0, 1.0) * noise);
    glitchOffset *= noiseIntensity;
  }

  //----------画面切替えアニメーションの実行（準備編）----------
  vec4 ProgressDiffuse;//サイクルによって切り替わる最終的な出力の土台

   //チェッカーボードのレイアウト
  vec4 checkerBoardDiffuseColor;

  float index = floor(vIndex + 0.1);

  if(activepage == 0.0) {//topページ
    index = floor(index - changeStep);//切り替わる度に表画面が変わる
    if(mod(index, 14.0) == 0.0) {
      singleOptimizedUv0.x += shivering;

      vec4 scrollDownDiffuse = texture2D(uTextures[0], singleOptimizedUv0 + glitchOffset);

      scrollDownDiffuse.rgb = mix(scrollDownDiffuse.rgb, 0.5 - scrollDownDiffuse.rgb, invert);

      scrollDownDiffuse.rgb *= 0.64;

      checkerBoardDiffuseColor = scrollDownDiffuse;
    } else if(mod(index, 12.0) == 0.0) {
      singleOptimizedUv1.x += shivering;
      vec4 chemicalDiffuse = texture2D(uTextures[1], singleOptimizedUv1 + glitchOffset);

      checkerBoardDiffuseColor = chemicalDiffuse;
    } else if(mod(index, 10.0) == 0.0) {
      vec4 airportDiffuse = texture2D(uTextures[2], singleOptimizedUv2 + glitchOffset);

      checkerBoardDiffuseColor = airportDiffuse;
    } else if(mod(index, 8.0) == 0.0) {
      checkerBoardDiffuseColor = arrowStripeColor;
    } else if(mod(index, 6.0) == 0.0) {
      checkerBoardDiffuseColor = waveColor;
    } else if(mod(index, 5.0) == 0.0) {
      checkerBoardDiffuseColor = gridColorSingle;
    } else if(mod(index, 4.0) == 0.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[3], singleOptimizedUv3 + glitchOffset);
    } else if(mod(index, 3.0) == 0.0) {
      checkerBoardDiffuseColor = cardiogramColor;
    } else {
      checkerBoardDiffuseColor = vec4(noiseColor, 3.0);
    }
  } else if(activepage == 1.0) {//aboutページ

    checkerBoardDiffuseColor = gridColor;

  } else if(activepage == 2.0) {//galleryページ

    index = floor(index - changeStep * 2.0);//切り替わる度に表字画面が変わる

    vec4 defaultDiffuse;

    if(mod(index, 10.0) == 0.0) {
      defaultDiffuse = texture2D(uTextures[0], singleOptimizedUv0 + glitchOffset);
    } else if(mod(index, 10.0) == 1.0) {
      defaultDiffuse = texture2D(uTextures[1], singleOptimizedUv1 + glitchOffset);
    } else if(mod(index, 10.0) == 2.0) {
      defaultDiffuse = texture2D(uTextures[2], singleOptimizedUv2 + glitchOffset);
    } else if(mod(index, 10.0) == 3.0) {
      defaultDiffuse = texture2D(uTextures[3], singleOptimizedUv3 + glitchOffset);
    } else if(mod(index, 10.0) == 4.0) {
      defaultDiffuse = texture2D(uTextures[4], singleOptimizedUv4 + glitchOffset);
    } else if(mod(index, 10.0) == 5.0) {
      defaultDiffuse = texture2D(uTextures[5], singleOptimizedUv5 + glitchOffset);
    } else if(mod(index, 10.0) == 6.0) {
      defaultDiffuse = texture2D(uTextures[6], singleOptimizedUv6 + glitchOffset);
    } else if(mod(index, 10.0) == 7.0) {
      defaultDiffuse = texture2D(uTextures[7], singleOptimizedUv7 + glitchOffset);
    } else if(mod(index, 10.0) == 8.0) {
      defaultDiffuse = texture2D(uTextures[8], singleOptimizedUv8 + glitchOffset);
    } else if(mod(index, 10.0) == 9.0) {
      defaultDiffuse = texture2D(uTextures[9], singleOptimizedUv9 + glitchOffset);
    }

    if(uNextIndex == -1.0) {
      checkerBoardDiffuseColor = defaultDiffuse;
    } else {
      vec4 currentTexture;
      vec4 nextTexture;

      vec2 transitionGlitchOffset = vec2(0.0, noise * 0.064) * (1.0 - uIndexTransition);

      // if(uDevice == 0.0 || uDevice == 1.0) {

      //   if(uCurrentIndex == 0.0) {
      //     currentTexture = texture2D(uTextures[0], singleOptimizedUv0 + transitionGlitchOffset);
      //   } else if(uCurrentIndex == 1.0) {
      //     currentTexture = texture2D(uTextures[1], singleOptimizedUv1 + transitionGlitchOffset);
      //   } else if(uCurrentIndex == 2.0) {
      //     currentTexture = texture2D(uTextures[2], singleOptimizedUv2 + transitionGlitchOffset);
      //   } else if(uCurrentIndex == 3.0) {
      //     currentTexture = texture2D(uTextures[3], singleOptimizedUv3 + transitionGlitchOffset);
      //   } else if(uCurrentIndex == 4.0) {
      //     currentTexture = texture2D(uTextures[4], singleOptimizedUv4 + transitionGlitchOffset);
      //   } else if(uCurrentIndex == 5.0) {
      //     currentTexture = texture2D(uTextures[5], singleOptimizedUv5 + transitionGlitchOffset);
      //   } else if(uCurrentIndex == 6.0) {
      //     currentTexture = texture2D(uTextures[6], singleOptimizedUv6 + transitionGlitchOffset);
      //   } else if(uCurrentIndex == 7.0) {
      //     currentTexture = texture2D(uTextures[7], singleOptimizedUv7 + transitionGlitchOffset);
      //   } else if(uCurrentIndex == 8.0) {
      //     currentTexture = texture2D(uTextures[8], singleOptimizedUv8 + transitionGlitchOffset);
      //   } else if(uCurrentIndex == 9.0) {
      //     currentTexture = texture2D(uTextures[9], singleOptimizedUv9 + transitionGlitchOffset);
      //   } else {
      //     currentTexture = defaultDiffuse;
      //   }

      //   if(uNextIndex == 0.0) {
      //     nextTexture = texture2D(uTextures[0], singleOptimizedUv0 + transitionGlitchOffset);
      //   } else if(uNextIndex == 1.0) {
      //     nextTexture = texture2D(uTextures[1], singleOptimizedUv1 + transitionGlitchOffset);
      //   } else if(uNextIndex == 2.0) {
      //     nextTexture = texture2D(uTextures[2], singleOptimizedUv2 + transitionGlitchOffset);
      //   } else if(uNextIndex == 3.0) {
      //     nextTexture = texture2D(uTextures[3], singleOptimizedUv3 + transitionGlitchOffset);
      //   } else if(uNextIndex == 4.0) {
      //     nextTexture = texture2D(uTextures[4], singleOptimizedUv4 + transitionGlitchOffset);
      //   } else if(uNextIndex == 5.0) {
      //     nextTexture = texture2D(uTextures[5], singleOptimizedUv5 + transitionGlitchOffset);
      //   } else if(uNextIndex == 6.0) {
      //     nextTexture = texture2D(uTextures[6], singleOptimizedUv6 + transitionGlitchOffset);
      //   } else if(uNextIndex == 7.0) {
      //     nextTexture = texture2D(uTextures[7], singleOptimizedUv7 + transitionGlitchOffset);
      //   } else if(uNextIndex == 8.0) {
      //     nextTexture = texture2D(uTextures[8], singleOptimizedUv8 + transitionGlitchOffset);
      //   } else if(uNextIndex == 9.0) {
      //     nextTexture = texture2D(uTextures[9], singleOptimizedUv9 + transitionGlitchOffset);
      //   } else {
      //     nextTexture = defaultDiffuse;
      //   }
      // } else {
      // }
      if(uCurrentIndex == 0.0) {
        currentTexture = texture2D(uTextures[0], fullScreenOptimizedUv0 + transitionGlitchOffset);
      } else if(uCurrentIndex == 1.0) {
        currentTexture = texture2D(uTextures[1], fullScreenOptimizedUv1 + transitionGlitchOffset);
      } else if(uCurrentIndex == 2.0) {
        currentTexture = texture2D(uTextures[2], fullScreenOptimizedUv2 + transitionGlitchOffset);
      } else if(uCurrentIndex == 3.0) {
        currentTexture = texture2D(uTextures[3], fullScreenOptimizedUv3 + transitionGlitchOffset);
      } else if(uCurrentIndex == 4.0) {
        currentTexture = texture2D(uTextures[4], fullScreenOptimizedUv4 + transitionGlitchOffset);
      } else if(uCurrentIndex == 5.0) {
        currentTexture = texture2D(uTextures[5], fullScreenOptimizedUv5 + transitionGlitchOffset);
      } else if(uCurrentIndex == 6.0) {
        currentTexture = texture2D(uTextures[6], fullScreenOptimizedUv6 + transitionGlitchOffset);
      } else if(uCurrentIndex == 7.0) {
        currentTexture = texture2D(uTextures[7], fullScreenOptimizedUv7 + transitionGlitchOffset);
      } else if(uCurrentIndex == 8.0) {
        currentTexture = texture2D(uTextures[8], fullScreenOptimizedUv8 + transitionGlitchOffset);
      } else if(uCurrentIndex == 9.0) {
        currentTexture = texture2D(uTextures[9], fullScreenOptimizedUv9 + transitionGlitchOffset);
      } else {
        currentTexture = defaultDiffuse;
      }

      if(uNextIndex == 0.0) {
        nextTexture = texture2D(uTextures[0], fullScreenOptimizedUv0 + transitionGlitchOffset);
      } else if(uNextIndex == 1.0) {
        nextTexture = texture2D(uTextures[1], fullScreenOptimizedUv1 + transitionGlitchOffset);
      } else if(uNextIndex == 2.0) {
        nextTexture = texture2D(uTextures[2], fullScreenOptimizedUv2 + transitionGlitchOffset);
      } else if(uNextIndex == 3.0) {
        nextTexture = texture2D(uTextures[3], fullScreenOptimizedUv3 + transitionGlitchOffset);
      } else if(uNextIndex == 4.0) {
        nextTexture = texture2D(uTextures[4], fullScreenOptimizedUv4 + transitionGlitchOffset);
      } else if(uNextIndex == 5.0) {
        nextTexture = texture2D(uTextures[5], fullScreenOptimizedUv5 + transitionGlitchOffset);
      } else if(uNextIndex == 6.0) {
        nextTexture = texture2D(uTextures[6], fullScreenOptimizedUv6 + transitionGlitchOffset);
      } else if(uNextIndex == 7.0) {
        nextTexture = texture2D(uTextures[7], fullScreenOptimizedUv7 + transitionGlitchOffset);
      } else if(uNextIndex == 8.0) {
        nextTexture = texture2D(uTextures[8], fullScreenOptimizedUv8 + transitionGlitchOffset);
      } else if(uNextIndex == 9.0) {
        nextTexture = texture2D(uTextures[9], fullScreenOptimizedUv9 + transitionGlitchOffset);
      } else {
        nextTexture = defaultDiffuse;
      }

      checkerBoardDiffuseColor = gridTransition(currentTexture, nextTexture, uIndexTransition, fullScreenUv, noise);
    }

  }

  //----------テロップアニメーション----------
  vec4 scrollingDiffuseColorNoise = texture2D(uTelopTexture, scrollingUv + glitchOffset);

  scrollingDiffuseColorNoise.rgb *= 0.83;

  //簡易dot加工
  scrollingDiffuseColorNoise.rgb = dotPattern(singleScreenUv, scrollingDiffuseColorNoise.rgb);

  //----------画面切替えアニメーションの実行（実行編）----------
  vec4 oddProgressDiffuse = scrollingDiffuseColorNoise;

  vec4 evenProgressDiffuse = checkerBoardDiffuseColor;

  ProgressDiffuse = mix(evenProgressDiffuse, oddProgressDiffuse, progress);

  //----------------test------------
  // ProgressDiffuse = checkerBoardDiffuseColor;
  // ProgressDiffuse = oddProgressDiffuse;
  //----------------test------------

//----------最終的な出力のベースを調整   ----------
  vec4 finalDiffuse;

  if(activepage == 0.0) {
    //-------top-------
    finalDiffuse = ProgressDiffuse;
  } else if(activepage == 1.0) {
    //-------profile-------
    finalDiffuse = checkerBoardDiffuseColor;
  } else {
    //-------gallery-------
    finalDiffuse = checkerBoardDiffuseColor;
    //モノクロに寄せる

    finalDiffuse.rgb = mix(finalDiffuse.rgb, vec3(dot(finalDiffuse.rgb, vec3(0.299, 0.587, 0.114))), 0.25);

    //明度を落とす（可読性の観点から）
    finalDiffuse.rbg *= 0.1;
  }

  if(uIsGallerySection == 1.0) {
    //ギャラリーのセクションに差し掛かっている
    finalDiffuse = scrollingDiffuseColor;
  }

  //----------フッター付近に到達----------

  float scrollEndProgress = easeInQuart(uIsScrollEnd);

  float footerTransition = pixelTransition(fullScreenUv, scrollEndProgress);

  finalDiffuse = mix(finalDiffuse, gridColor, footerTransition);

  //----------エフェクト----------

  vec3 color = finalDiffuse.rgb;

  //グレイン
  color.rgb = blendOverlay(color.rgb, vec3(hashValue), 0.06);

	// 走査線（シングル）
  color *= 0.98 - sin(fullScreenUv.y * 200.0 - uTime * 100.0) * 0.01;

	// ヴィネット
  if(EvenOdd == 0.0) {
    color *= smoothstep(1.0, 0.3, length(fullScreenUv - 0.5));
  } else {
    color *= smoothstep(1.0, 0.3, length(singleScreenUv - 0.5));
  }

  //----------画面切り替え時のエフェクト----------
  if(activepage == 0.0 && uIsGallerySection == 0.0 // top page
  ) {
    if(shouldShowNoise) {
      color = mix(color, noiseColor, noiseIntensity * 0.3);
    };//係数は実物を見ながら微調整
  }

  if(activepage == 2.0 // gallery page
  ) {
    if(shouldShowNoise) {
      color = mix(color, mix(color, noiseColor, 0.5), noiseIntensity * 0.25);
    };
  }

  //--------------ページ遷移----------------
  //ページ遷移中
  if(uIsTransitioning == 1.0) {
    color = fullScreenArrowStripeColor.rgb * uTransition;
  }

  //--------------ロード完了時---------------
  float loadedProgress = uLoaded;

  float threshold;
  //0どうしの比較を避けるため、始点と終点に多少のバッファを設けている
  if(uDevice == 1.0) {//@mobile
    threshold = map(loadedProgress, 0.78, 1.0, 0.0, 10.0, true);
  } else {
    threshold = map(loadedProgress, 0.64, 1.0, 0.0, 10.0, true);
  }

  float loadedTransition = step(adjustedDistance + 0.01, threshold);

  vec3 waitingColor;

  if(uActivePage == 2.0) {
    waitingColor = gridColor.rgb;
  } else {
    waitingColor = texture2D(uTextures[3], singleOptimizedUv3).rgb;
  }

  color = mix(waitingColor, color, loadedTransition);

  //----------最終的な明度調整----------
  //(スクロール速度による明度強化も含めるかな？？)・・・あってもなくてもいい
  colorIntensity = 0.80;
  // colorIntensity = 0.9 + 0.1 * clamp(uVelocity, 0.0, 1.0);

  if(uDevice == 1.0) {//@mobile
    colorIntensity *= 2.0;
  }

  //テスト用
  // color = vec3(mask);

  color *= colorIntensity;

  gl_FragColor = vec4(color, finalDiffuse.a);
}