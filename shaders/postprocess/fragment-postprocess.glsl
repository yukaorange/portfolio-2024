uniform float uGamma;
uniform float uOffset;
uniform float uDarkness;
uniform float uAspect;
uniform float uStrength;
uniform float uRadius;
uniform float uThreshold;
uniform float uIsMobile;
uniform float uActivePage;
uniform float uTransition;
uniform float uIsScrollStart;
uniform float uTime;
uniform float uLoadingTransition;
uniform float uLoadingTransitionEaseIn;
uniform float uLoadingTransitionEaseOut;
uniform vec2 uResolution;
uniform sampler2D tDiffuse;
varying vec2 vUv;

#pragma glslify: getTickedTime = require('../utils/getTickedTime.glsl');
#pragma glslify: gammaCorrect = require('../utils/gamma.glsl');
#pragma glslify: random = require('../utils/random.glsl');
#pragma glslify: snoise = require('../utils/snoise.glsl');
#pragma glslify: map = require('../utils/map.glsl');
#pragma glslify: radialStrength = require('../utils/radialStrength.glsl');
#pragma glslify: linearToSRGB = require('../utils/linerToSRGB.glsl');
#pragma glslify: ripple = require('../utils/ripple.glsl');
#pragma glslify: quake = require('../utils/quake.glsl');
#pragma glslify: blur = require('../utils/blur.glsl');
#pragma glslify: getLuminance = require('../utils/getLuminance.glsl');
#pragma glslify: grayScale = require('../utils/grayScale.glsl');
#pragma glslify: halftone = require('../utils/halftone.glsl');
#pragma glslify: blendOverlay = require('../utils/blend.glsl');

void main() {

  float PI = 3.1415926535897932384626433832795;

  vec2 uv = vUv;

  vec2 distortionUv = uv;

  vec2 adjustedUv = vUv;
  adjustedUv -= 0.5;
  adjustedUv.x *= uAspect;
  adjustedUv += 0.5;

  vec3 color;

  //-------ユーティリティ-------
  //ノイズ
  float noise = snoise(vec2(vUv.y * 60.0, sin(uTime * 40.0)));

  //数コンマ刻みの時間(メトロノーム的な)
  float delta = 1.0 / 15.0;
  float tickedTime = getTickedTime(uTime, delta);
  float tickedRandom = random(tickedTime);

  //定期的に発火する効果のための時間管理
  float totalDuration = 5.0;
  float effectDuration = 0.1;//効果の持続時間
  //切り替えのサイクルを設定
  float cycle = mod(uTime, totalDuration);//0.0 ～ totalDurationを繰り返す
  float normalizedCycle = cycle / totalDuration;//0.0 ～ 1.0に正規化
  float effectActivation = 1.0 - smoothstep(0.0, effectDuration, normalizedCycle);

  //----------shivering -------
  float shiveringProgress;

  float shiveringProgress1 = map(uLoadingTransition, 0.0, 0.64, 0.0, 1.0, true);
  float shiveringProgress2 = map(uLoadingTransition, 0.8, 0.82, 0.0, 1.0, true);
  float shiveringProgress3 = map(uLoadingTransitionEaseOut, 0.0, 0.98, 0.0, 1.0, true);

  shiveringProgress = shiveringProgress1 + shiveringProgress2 + shiveringProgress3;

  float shiveringKeepEdge = 0.01;
  //keepEdgeの値を小さくすると、1でいる時間が長くなる

  shiveringProgress = smoothstep(0.0, shiveringKeepEdge, abs(sin(shiveringProgress * PI)));

  float shiveringNoise = snoise(vec2(uTime * 10.0));

  float shiveringIntensity;

  if(uIsMobile == 1.0) {//@mobile
    shiveringIntensity = 0.012;
  } else {
    shiveringIntensity = 0.001;
  }

  float shivering = sin(uv.y * 1500.0 + sin(uv.y * 10.0)) * shiveringNoise * shiveringIntensity;

  shivering *= shiveringProgress;

  uv.x += shivering;

  //-------deform line--------
  float deformProgress;

  float deformProgress1 = map(uLoadingTransition, 0.0, 0.4, 0.0, 1.0, true);
  float deformProgress2 = map(uLoadingTransition, 0.72, 0.96, 0.0, 1.0, true);

  deformProgress = deformProgress1 + deformProgress2;

  float deformKeepEdge = 0.01;
  //keepEdgeの値を小さくすると、1でいる時間が長くなる

  deformProgress = smoothstep(0.0, deformKeepEdge, abs(sin(deformProgress * PI)));

  vec2 verticalWave = vec2(0.0, sin(uTime * 10.0));//縦方向に波を作る

  verticalWave *= noise * 0.01;//縦方向の波の振幅をノイズで変化させる

  vec2 timeOffset = vec2(uTime * 0.1);

  vec2 deformMap = uv + verticalWave;//波を適用

  deformMap.y -= timeOffset.y;//時間経過で波を動かす

  deformMap *= vec2(1.0, 10.0);//y方向に分割する細かさ
  deformMap = floor(deformMap);//y方向に分割

  float deformNoise = snoise(deformMap) * 0.006;//ノイズに変換することで、縦方向に波上のランダムな変化が生まれる

  deformNoise *= deformProgress;

  uv.x += deformNoise;

   //---------クエイクエフェクト-------

  float quakeProgress;

  float quakeProgress1 = map(uLoadingTransition, 0.0, 0.24, 0.0, 1.0, true);
  float quakeProgress2 = map(uLoadingTransition, 0.30, 0.34, 0.0, 1.0, true);
  float quakeProgress3 = map(uLoadingTransition, 0.4, 0.44, 0.0, 1.0, true);

  quakeProgress = quakeProgress1 + quakeProgress2 + quakeProgress3;

  float quakeKeepEdge = 0.01;//keepEdgeの値を小さくすると、1でいる時間が長くなる

  quakeProgress = smoothstep(0.0, quakeKeepEdge, abs(sin(quakeProgress * PI)));

  float sliceCount = 15.0;
  float quakeIntensity = 0.0024;

  float quakeOffset = quake(uv.y, sliceCount, uTime, quakeIntensity);

  quakeOffset *= quakeProgress;

  uv.x += quakeOffset;

  //----------ベースカラー（ここまでに行ったUVの変換の影響を受けます）--------
  vec4 texColor = texture2D(tDiffuse, uv);

  color = texColor.rgb;
  // vec3 testColor = texColor.rgb;

  //-------ピクセラレーション(FVでのみパネルの変更に連動もある) -------
  float pixelGlitchProgress;

  float pixelGlitchProgress1 = map(uLoadingTransition, 0.0, 0.6, 0.0, 1.0, true);
  float pixelGlitchProgress2 = map(uLoadingTransition, 0.7, 0.8, 0.0, 1.0, true);
  float pixelGlitchProgress3 = map(uLoadingTransition, 0.84, 0.98, 0.0, 1.0, true);

  pixelGlitchProgress = pixelGlitchProgress1 + pixelGlitchProgress2 + pixelGlitchProgress3;

  float pixelGlitchKeepEdge = 1.0;
  //keepEdgeの値を小さくすると、1でいる時間が長くなる

  pixelGlitchProgress = smoothstep(0.0, pixelGlitchKeepEdge, abs(sin(pixelGlitchProgress * PI)));

  vec2 pixelGlicthUv = vUv;

  float glicthStep;
  if(uIsMobile == 1.0) {
    glicthStep = mix(48.0, 24.0, tickedRandom);
  } else {
    glicthStep = mix(64.0, 96.0, tickedRandom);
  }

  pixelGlicthUv.x = round(pixelGlicthUv.x * glicthStep) / glicthStep;

  vec4 glitchDiffuse = texture2D(tDiffuse, pixelGlicthUv);

  vec4 glitchColor = mix(texColor, glitchDiffuse, effectActivation);//FV時の定期発火

  if(uActivePage == 0.0 && uIsScrollStart == 0.0) {
    color.rgb = glitchColor.rgb;
  }

  color.rgb = mix(color.rgb, glitchDiffuse.rgb, pixelGlitchProgress);//ローディング時の発火

  //-------レンズディストーション（ページ遷移時）-------

  vec2 transitionDistortionUv = distortionUv * 2.0 - 1.0;//-1.0 ～ 1.0
  float transitionAbberationValue = pow(length(transitionDistortionUv), 2.0);

  vec3 transitionLensBlur = texture2D(tDiffuse, distortionUv - transitionAbberationValue * 0.00625).rgb;
  vec3 transitionLensBlur2 = texture2D(tDiffuse, distortionUv + transitionAbberationValue * 0.0125).rgb;
  vec3 transitionLensBlur3 = texture2D(tDiffuse, distortionUv + transitionAbberationValue * 0.025).rgb;

  vec3 compositeColor = grayScale(color + transitionLensBlur + transitionLensBlur2) / 3.0;
  compositeColor += grayScale(color - transitionLensBlur3) * 1.0;

  color = mix(color, compositeColor, uTransition);

  //-----------色ずらし系の処理ここから ----------
  float colorOffsetIntensity;

  if(uIsMobile == 1.0) {//@mobile
    colorOffsetIntensity = 4.0;
  } else {
    colorOffsetIntensity = 5.0;
  }

  //----------リップル波（不採用）--------
  // float rippleProgress = map(uLoadingTransition, 0.0, 1.0, 0.0, 1.0, true);

  // float rippleKeepEdge = 1.0;

  // rippleProgress = smoothstep(0.0, rippleKeepEdge, abs(sin(rippleProgress * PI)));

  // vec3 rippleDiffuse = ripple(adjustedUv, rippleProgress, uAspect);

  // vec2 rippleBaseOffset = normalize(rippleDiffuse.xy) * rippleDiffuse.b + vec2(0.001);

  // vec2 rippleRedOffset = rippleBaseOffset * 0.12 * colorOffsetIntensity;
  // vec2 rippleGreenOffset = rippleBaseOffset * -0.12 * colorOffsetIntensity;
  // vec2 rippleBlueOffset = rippleBaseOffset * 0.08 * colorOffsetIntensity;

  // float rippleAlpha = rippleDiffuse.b * 0.0025;

  // vec3 rippleRed = texture2D(tDiffuse, uv + rippleRedOffset).rgb;
  // vec3 rippleGreen = texture2D(tDiffuse, uv + rippleGreenOffset).rgb;
  // vec3 rippleBlue = texture2D(tDiffuse, uv + rippleBlueOffset).rgb;

  // rippleRed += rippleAlpha;
  // rippleGreen += rippleAlpha;
  // rippleBlue += rippleAlpha;

  // vec3 rippleColor = vec3(rippleRed.r, rippleGreen.g, rippleBlue.b);

  // color = blendOverlay(color, rippleColor, rippleProgress);

  //---------放射ディストーション-------
  float distortionProgress;

  float distortionProgress1 = map(uLoadingTransition, 0.0, 1.0, 0.0, 1.0, true);
  float distortionProgress2 = map(uLoadingTransitionEaseOut, 0.0, 1.0, 0.0, 1.0, true);

  distortionProgress = distortionProgress1 + distortionProgress2;

  float distortionKeepEdge = 0.01;
  //keepEdgeの値を小さくすると、1でいる時間が長くなる

  distortionProgress = smoothstep(0.0, distortionKeepEdge, abs(sin(distortionProgress * PI)));

  float distortionStrength = radialStrength(adjustedUv, 1.0, 0.03, 1.0);

  vec2 baseOffset = normalize(uv.xy) * distortionStrength;

  vec2 redOffset = baseOffset * -0.07 * colorOffsetIntensity;
  vec2 greenOffset = baseOffset * 0.08 * colorOffsetIntensity;
  vec2 blueOffset = baseOffset * -0.1 * colorOffsetIntensity;

  vec3 red = texture2D(tDiffuse, uv + redOffset).rgb;
  vec3 green = texture2D(tDiffuse, uv + greenOffset).rgb;
  vec3 blue = texture2D(tDiffuse, uv + blueOffset).rgb;

  vec3 distortionColor = vec3(red.r, green.g, blue.b);

  color = blendOverlay(color, distortionColor, distortionProgress);
  // color = blendOverlay(color, distortionColor, 1.0);

  //------低負荷ブルームエフェクト（これは常時ON）------
  vec3 blurred = blur(tDiffuse, uv, uResolution, uRadius, 2);

  float brightness = getLuminance(blurred);

  brightness = brightness > uThreshold ? 1.0 : 0.0;

  vec3 bloom = color + blurred * uStrength * smoothstep(uThreshold, uThreshold + 0.1, brightness);

  color = bloom;

  //-----------------ブラー ----------------

  float blurProgress;

  float blurProgress1 = map(uLoadingTransition, 0.0, 0.4, 0.0, 1.0, true);
  float blurProgress2 = map(uLoadingTransition, 0.42, 0.48, 0.0, 1.0, true);
  float blurProgress3 = map(uLoadingTransition, 0.5, 0.8, 0.0, 1.0, true);
  float blurProgress4 = map(uLoadingTransitionEaseOut, 0.0, 1.0, 0.0, 1.0, true);

  blurProgress = blurProgress1 + blurProgress2 + blurProgress3 + blurProgress4;

  float blurKeepEdge = 1.0;
  //keepEdgeの値を小さくすると、1でいる時間が長くなる

  blurProgress = smoothstep(0.0, blurKeepEdge, abs(sin(blurProgress * PI)));

  vec3 blurColor = blur(tDiffuse, uv, uResolution, uRadius, 5);

  color = mix(color, blurColor, blurProgress);

	// ----------ヴィネット---------
  float vignetProgress = map(uLoadingTransitionEaseIn, 0.0, 0.8, 0.0, 1.0, true);

  float vignetEdge = 0.2;

  vignetEdge *= uAspect;//アスペクト比を考慮
  vignetEdge *= 1.00;//大きさを調整
  vignetEdge += vignetProgress;// +0 -> +1

  float offset = 1.8;//ぼかしの範囲

  float area = length(adjustedUv - 0.5);

  float vignetArea = smoothstep(vignetEdge - offset, vignetEdge, area);

  color *= (1.0 - vignetArea);

  //----------ハーフトーン---------

  float halftoneProgress;

  float halftoneProgress1 = map(uLoadingTransition, 0.4, 0.44, 0.0, 1.0, true);
  float halftoneProgress2 = map(uLoadingTransition, 0.6, 0.64, 0.0, 1.0, true);

  halftoneProgress = halftoneProgress1 + halftoneProgress2;

  float halftoneKeepEdge = 0.1;
  //keepEdgeの値を小さくすると、1でいる時間が長くなる

  halftoneProgress = smoothstep(0.0, halftoneKeepEdge, abs(sin(halftoneProgress * PI)));

  vec4 halfToneColor = halftone(tDiffuse, uv, uResolution, 512.0, 0.25, 1.5, true);

  halfToneColor.rgb *= 0.08;
  halfToneColor.rgb += color.rgb * 0.25;

  color = blendOverlay(color, halfToneColor.rgb, halftoneProgress);

  //-------------グレースケール-------
  float grayProgress;

  float grayProgress1 = map(uLoadingTransition, 0.0, 0.8, 0.0, 1.0, true);
  float grayProgress2 = map(uLoadingTransition, 0.84, 0.86, 0.0, 1.0, true);
  float grayProgress3 = map(uLoadingTransition, 0.9, 0.98, 0.0, 1.0, true);

  grayProgress = grayProgress1 + grayProgress2 + grayProgress3;

  float grayKeepEdge = 0.01;
  //keepEdgeの値を小さくすると、1でいる時間が長くなる

  grayProgress = smoothstep(0.0, grayKeepEdge, abs(sin(grayProgress * PI)));

  vec3 grayColor = grayScale(color);

  color = mix(color, grayColor, grayProgress);

  //------ガンマ補正（常に有効）------
  color = pow(color, vec3(2.2));
  color = gammaCorrect(color, uGamma);
  color = linearToSRGB(color);

  //-------test--------
  // color = vec3(halfToneColor.rgb);

  gl_FragColor = vec4(color.rgb, texColor.a);
}