uniform float uAspect;
uniform float uTelopAspect;
uniform float uCount;
uniform float uTime;
uniform float uTransition;
uniform float uIsTransitioning;
uniform float uSpeed;
uniform float uVelocity;
uniform float uActivePage;
uniform float uIsGallerySection;
uniform float uDevice;
uniform sampler2D uTextures[10];
uniform sampler2D uNoiseTexture;
uniform sampler2D uTelopTexture;
uniform float uTextureAspectRatios[10];
uniform float uRowLengths[5];
uniform vec2 uResolution;

const float PI = 3.14159265359;

varying float vIndex;//1 ～ count * count
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vInstacePosition;

#pragma glslify: optimizationTextureUv = require('../utils/optimizeUv.glsl');
#pragma glslify: hash = require('../utils/hash.glsl');
// #pragma glslify: cnoise = require('../utils/cnoise.glsl');
#pragma glslify: snoise = require('../utils/snoise.glsl');
// #pragma glslify: rand = require('../utils/random.glsl');
// #pragma glslify: wave = require('../utils/wave.glsl');
#pragma glslify: cardiogram = require('../utils/electrocardiogram.glsl');
#pragma glslify: createGrid = require('../utils/grid.glsl');
#pragma glslify: blendOverlay = require('../utils/blend.glsl');
#pragma glslify: crtEffect = require('../utils/crtEffect.glsl');

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
  vec2 singleScreenOptimizedTelopUv = optimizationTextureUv(singleScreenUv, uAspect, uTelopAspect);
  // vec2 fullScreenOptimizedUv0 = optimizationTextureUv(fullScreenUv, uAspect, uTextureAspectRatios[0]);

 //各パネルを使用する場合のテクスチャを取得する場合
  // vec4 singleDiffuseColor0 = texture2D(uTextures[0], singleOptimizedUv0);

  //各全体で一つのパネルとした場合のテクスチャを取得する場合
  // vec4 fullScreenDiffuseColor0 = texture2D(uTextures[0], fullScreenOptimizedUv0);

  //top pageのテキストが流れるアニメーションに使用するテクスチャ出力
  vec2 scrollingUv = fullScreenOptimizedTelopUv;
  int row = int(floor(scrollingUv.y * 5.0));//テクスチャは5行に分かれたテキストであるため。
  float speed = uSpeed * (1.0 / uRowLengths[row]);//各行にふさわしいスピードを設定
  float rowLength = uRowLengths[row];

  float scrollingOffset = fract(uTime * 2.0 * speed);

  scrollingUv.x = fract((scrollingUv.x + scrollingOffset));
  float compressdX = scrollingUv.x * rowLength;//各行の空白部分はサンプリングしないので、その部分を圧縮
  scrollingUv.x = mod(compressdX + scrollingOffset, rowLength);//圧縮した部分を元に戻す。例えば、0.7の幅だとしたら、0.7の長さが1.0の長さになるようにする。（自分用のメモです）

  //singleScreenのテロップに合っても同様(速度は調整)
  vec2 singleScrollingUv = singleScreenOptimizedTelopUv;

  int singleRow = int(floor(singleScrollingUv.y * 5.0));//テクスチャは5行に分かれたテキストであるため。
  speed = uSpeed * (1.0 / uRowLengths[singleRow]);

  singleScrollingUv.x = fract((singleScrollingUv.x + scrollingOffset));

  float singleCompressdX = singleScrollingUv.x * rowLength;

  singleScrollingUv.x = mod(singleCompressdX + scrollingOffset, rowLength);

  // vec4 scrollingDiffuseColor = texture2D(uTextures[0], scrollingUv);//glitchでサンプリングをずらすため、diffuseの決定は後述にまわす(下記テロップ画像アニメーション)

  //----------ユーティリティ-----------

  float colorIntensity;//明度の調節用

  float activepage = floor(uActivePage);//ページ判定 0:top 1:about 2:gallery系

  //汎用ノイズ
  float noise = snoise(vec2(vUv.y * 60.0, sin(uTime * 40.0)));

  // float baseNoise = texture2D(uNoiseTexture, singleScreenUv).r;
  // float variation = hash(singleScreenUv + uTime);
  // noise = mix(baseNoise, variation, 0.2);

  //hash値
  float hashValue = hash(singleScreenUv + mod(uTime, 1.0) + 214.0) * 0.7;

  // ---------- 汎用画像 ----------

  //汎用 ノイズ画面
  vec3 noiseColor = vec3(hashValue);//ベースとなる砂嵐

  //汎用 等高線画面
  // vec4 waveColor;

  // float waveIntensity = wave(singleScreenUv.x, singleScreenUv.y) + 2.0;

  // waveIntensity *= 1.23 * abs(sin(PI / 2.0 + uTime * 0.2) + 1.5);

  // float waveDiffuse = fract(waveIntensity);

  // if(mod(waveIntensity, 2.0) > 1.0) {
  //   waveDiffuse = 1.0 - waveDiffuse;
  // }

  // waveDiffuse = waveDiffuse / fwidth(waveIntensity);

  // waveDiffuse = clamp(waveDiffuse, 0.0, 0.5);

  // waveColor = vec4(vec3(waveDiffuse), 1.0);

  //汎用 心電図画面
  vec4 cardiogramColor = vec4(cardiogram(singleScreenUv, vec2(4.0, 3.0), uTime), 1.0);

  //グリッド線画面(aboutページ用)
  vec4 gridColor = vec4(createGrid(fullScreenUv, vec2(8.0, 6.0), uTime), 1.0);
  vec4 gridColorSingle = vec4(createGrid(singleScreenUv, vec2(4.0, 3.0), uTime * 3.0), 1.0);

  //--------画面切替えアニメーション---------

  //画面切り替えの設定
  float totalDuration = 5.0;
  float transitionDuration = 0.01;
  float noiseDuration = 0.2;//これは切り替え時にノイズが出る時間の長さとなる

  float changeStep = 7.0 * floor(uTime / (totalDuration * 1.0));//基本変化（横方向）

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
    glitchOffset = vec2(0.0, mod(uTime * 3.0, 1.0) * noise);

    glitchOffset *= noiseIntensity;
  }

  vec4 ProgressDiffuse;//サイクルによって切り替わる最終的な出力の土台

   //チェッカーボードのレイアウト
  vec4 checkerBoardDiffuseColor;

  float index = floor(vIndex + 0.1);

  if(activepage == 0.0) {
    index = floor(index - changeStep);//切り替わる度に表画面が変わる
    if(mod(index, 24.0) == 0.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[0], singleOptimizedUv0 + glitchOffset);
    } else if(mod(index, 14.0) == 0.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[1], singleOptimizedUv1 + glitchOffset);
    } else if(mod(index, 12.0) == 0.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[2], singleOptimizedUv2 + glitchOffset);
    } else if(mod(index, 10.0) == 0.0) {
      checkerBoardDiffuseColor = texture2D(uTelopTexture, singleScrollingUv + glitchOffset);
    } else if(mod(index, 8.0) == 0.0) {
      checkerBoardDiffuseColor = gridColorSingle;
    } else if(mod(index, 5.0) == 0.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[3], singleOptimizedUv3 + glitchOffset);
    } else if(mod(index, 3.0) == 0.0) {
      checkerBoardDiffuseColor = cardiogramColor;
    } else {
      checkerBoardDiffuseColor = vec4(noiseColor, 3.0);
    }
  } else if(activepage == 1.0) {

    checkerBoardDiffuseColor = gridColor;

  } else if(activepage == 2.0) {

    index = floor(index - changeStep);//切り替わる度に表字画面が変わる

    if(mod(index, 10.0) == 0.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[0], singleOptimizedUv0 + glitchOffset);

    } else if(mod(index, 10.0) == 1.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[1], singleOptimizedUv1 + glitchOffset);

    } else if(mod(index, 10.0) == 2.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[2], singleOptimizedUv2 + glitchOffset);
    } else if(mod(index, 10.0) == 3.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[3], singleOptimizedUv3 + glitchOffset);
    } else if(mod(index, 10.0) == 4.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[4], singleOptimizedUv4 + glitchOffset);
    } else if(mod(index, 10.0) == 5.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[5], singleOptimizedUv5 + glitchOffset);
    } else if(mod(index, 10.0) == 6.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[6], singleOptimizedUv6 + glitchOffset);
    } else if(mod(index, 10.0) == 7.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[7], singleOptimizedUv7 + glitchOffset);
    } else if(mod(index, 10.0) == 8.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[8], singleOptimizedUv8 + glitchOffset);
    } else if(mod(index, 10.0) == 9.0) {
      checkerBoardDiffuseColor = texture2D(uTextures[9], singleOptimizedUv9 + glitchOffset);
    }

  }

  //----------テロップ画像アニメーション----------
  vec4 scrollingDiffuseColorNoise = texture2D(uTelopTexture, scrollingUv + glitchOffset);

  //簡易crt加工
  scrollingDiffuseColorNoise.rgb = crtEffect(fullScreenUv, vec2(1280, 960), scrollingDiffuseColorNoise.rgb, 1.67);

  // vec4 scrollingDiffuseColor = texture2D(uTelopTexture, scrollingUv);

  //----------画面切替えアニメーションの実行----------
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
    finalDiffuse = ProgressDiffuse;
  } else if(activepage == 1.0) {
    finalDiffuse = checkerBoardDiffuseColor;
  } else {
    finalDiffuse = checkerBoardDiffuseColor;
    //モノクロに寄せる
    finalDiffuse.rgb = mix(finalDiffuse.rgb, vec3(dot(finalDiffuse.rgb, vec3(0.299, 0.587, 0.114))), 0.64);
    //明度を落とす（可読性の観点から）
    finalDiffuse.rbg *= 0.25;
  }

  if(uIsGallerySection == 1.0) {//ギャラリーのセクションに差し掛かっている
    finalDiffuse = gridColor;
  }

  //----------エフェクト----------

  vec3 color = finalDiffuse.rgb;

  //グレイン
  color.rgb = blendOverlay(color.rgb, vec3(hashValue), 0.16);

  // 点滅
  // color *= step(0.0, sin(fullScreenUv.y * 5.0 - uTime * 2.0 * noise)) * 0.05 + 0.98;

  //走査線（画面全体）
  // color *= step(0.0, sin(fullScreenUv.y * 4.0 - uTime * 0.9)) * 0.05 + 1.98;

	// 走査線（シングル）
  color *= 0.98 - sin(fullScreenUv.y * 200.0 - uTime * 100.0) * 0.01;

	// ヴィネット
  if(EvenOdd == 0.0) {
    color *= smoothstep(1.0, 0.3, length(fullScreenUv - 0.5));
  } else {
    color *= smoothstep(1.0, 0.3, length(singleScreenUv - 0.5));
  }

  //----------画面切り替え時のノイズの表示----------
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

  //----------最終的な明度調整----------
  //(スクロール速度による明度強化も含む)・・・ｋはあってもなくてもいい
  colorIntensity = 0.9 + 0.1 * clamp(uVelocity, 0.0, 1.0);

  if(uDevice == 1.0) {//@mobile
    colorIntensity *= 1.18;
  }

  //ページ遷移中
  if(uIsTransitioning == 1.0) {
    color = noiseColor * uTransition;
  }

  //テスト用
  // color = testcolor;

  color *= colorIntensity;

  gl_FragColor = vec4(color, finalDiffuse.a);
}