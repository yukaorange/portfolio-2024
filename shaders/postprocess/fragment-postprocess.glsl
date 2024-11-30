uniform float uGamma;
uniform float uOffset;
uniform float uDarkness;
uniform float uAspect;
uniform float uStrength;
uniform float uRadius;
uniform float uThreshold;
uniform float uTime;
uniform float uLoadingTransition;
uniform vec2 uResolution;
uniform sampler2D tDiffuse;
varying vec2 vUv;

#pragma glslify: gammaCorrect = require('../utils/gamma.glsl');
#pragma glslify: snoise = require('../utils/snoise.glsl');
#pragma glslify: map = require('../utils/map.glsl');
#pragma glslify: radialStrength = require('../utils/radialStrength.glsl');
#pragma glslify: linearToSRGB = require('../utils/linerToSRGB.glsl');
#pragma glslify: ripple = require('../utils/ripple.glsl');
#pragma glslify: blur = require('../utils/blur.glsl');
#pragma glslify: getLuminance = require('../utils/getLuminance.glsl');
#pragma glslify: grayScale = require('../utils/grayScale.glsl');
#pragma glslify: blendOverlay = require('../utils/blend.glsl');

void main() {

  float PI = 3.1415926535897932384626433832795;

  vec2 uv = vUv;

  vec2 adjustedUv = vUv;
  adjustedUv -= 0.5;
  adjustedUv.x *= uAspect;
  adjustedUv += 0.5;

  vec3 color;

  //----------shivering -------
  float shiveringProgress = map(uLoadingTransition, 0.2, 1.0, 0.0, 1.0, true);

  float shiveringKeepEdge = 0.01;
  //keepEdgeの値を小さくすると、1でいる時間が長くなる

  shiveringProgress = smoothstep(0.0, shiveringKeepEdge, abs(sin(shiveringProgress * PI)));

  float shiveringNoise = snoise(vec2(uTime * 10.0));

  float shivering = sin(uv.y * 1500.0 + sin(uv.y * 10.0)) * shiveringNoise * 0.005;

  shivering *= shiveringProgress;

  uv.x += shivering;

  //-------deform line--------
  float deformProgress = map(uLoadingTransition, 0.3, 0.8, 0.0, 1.0, true);

  float deformKeepEdge = 0.4;
  //keepEdgeの値を小さくすると、1でいる時間が長くなる

  deformProgress = smoothstep(0.0, deformKeepEdge, abs(sin(deformProgress * PI)));

  float deformNoise = snoise(floor((vUv + vec2(0.0, uTime)) * vec2(1.0, 2.0))) * 0.004;

  deformNoise *= deformProgress;

  uv.x += deformNoise;

  //----------ベースカラー--------
  vec4 texColor = texture2D(tDiffuse, uv);
  color = texColor.rgb;

  //----------block noise---------
  // float blockNoiseProgress = map(uLoadingTransition, 0.3, 0.8, 0.0, 1.0, true);

  // float blockNoiseKeepEdge = 0.01;
  // //keepEdgeの値を小さくすると、1でいる時間が長くなる

  // blockNoiseProgress = smoothstep(0.0, blockNoiseKeepEdge, abs(sin(blockNoiseProgress * PI)));

  // float blockTime = floor(uTime * 10.0);

  // float n1 = snoise(floor(uv * vec2(4.0, 5.0) + blockTime) * 0.5 + 0.5);
  // float n2 = snoise(floor(uv * vec2(5.0, 6.0) + blockTime) * 0.5 + 0.5);
  // float n3 = snoise(floor(uv * vec2(6.0, 4.0) + blockTime) * 0.5 + 0.5);

  // float compositionNoise = n1 + n2 + n3;

  // compositionNoise = smoothstep(0.4, 0.5, compositionNoise);

  // vec3 aberrattion;

  // aberrattion.r = texture2D(tDiffuse, uv - vec2(0.01)).r;
  // aberrattion.g = texture2D(tDiffuse, uv - vec2(0.0)).g;
  // aberrattion.b = texture2D(tDiffuse, uv + vec2(0.01)).b;

  // color = mix(color, aberrattion, compositionNoise);

  //-----------色ずらし系の処理ここから ----------
  float colorOffsetIntensity = 2.0;

  //----------リップル波--------
  float rippleProgress = map(uLoadingTransition, 0.4, 1.0, 0.0, 1.0, true);

  vec3 rippleDiffuse = ripple(adjustedUv, rippleProgress, uAspect);

  vec2 rippleBaseOffset = normalize(rippleDiffuse.xy) * rippleDiffuse.b + vec2(0.001);

  vec2 rippleRedOffset = rippleBaseOffset * 0.24 * colorOffsetIntensity;
  vec2 rippleGreenOffset = rippleBaseOffset * -0.33 * colorOffsetIntensity;
  vec2 rippleBlueOffset = rippleBaseOffset * 0.32 * colorOffsetIntensity;

  float rippleAlpha = rippleDiffuse.b * 0.0025;

  vec3 rippleRed = texture2D(tDiffuse, uv + rippleRedOffset).rgb;
  vec3 rippleGreen = texture2D(tDiffuse, uv + rippleGreenOffset).rgb;
  vec3 rippleBlue = texture2D(tDiffuse, uv + rippleBlueOffset).rgb;

  rippleRed += rippleAlpha;
  rippleGreen += rippleAlpha;
  rippleBlue += rippleAlpha;

  vec3 rippleColor = vec3(rippleRed.r, rippleGreen.g, rippleBlue.b);

  color = blendOverlay(color, rippleColor, 0.5);

  //---------放射ディストーション-------
  float distortionProgress = map(uLoadingTransition, 0.0, 1.0, 0.0, 1.0, true);

  float distortionKeepEdge = 0.75;
  //keepEdgeの値を小さくすると、1でいる時間が長くなる

  distortionProgress = smoothstep(0.0, distortionKeepEdge, abs(sin(distortionProgress * PI)));

  float distortionStrength = radialStrength(adjustedUv, 1.0, 0.04, distortionProgress);

  vec2 baseOffset = normalize(uv.xy) * distortionStrength;

  vec2 redOffset = baseOffset * -0.14 * colorOffsetIntensity;
  vec2 greenOffset = baseOffset * 0.16 * colorOffsetIntensity;
  vec2 blueOffset = baseOffset * -0.01 * colorOffsetIntensity;

  vec3 red = texture2D(tDiffuse, uv + redOffset).rgb;
  vec3 green = texture2D(tDiffuse, uv + greenOffset).rgb;
  vec3 blue = texture2D(tDiffuse, uv + blueOffset).rgb;

  vec3 distortionColor = vec3(red.r, green.g, blue.b);

  color = blendOverlay(color, distortionColor, 0.5);

  //------低負荷ブルームエフェクト------
  vec3 blurred = blur(tDiffuse, uv, uResolution, uRadius, 2);

  float brightness = getLuminance(blurred);

  brightness = brightness > uThreshold ? 1.0 : 0.0;

  vec3 bloom = color + blurred * uStrength * smoothstep(uThreshold, uThreshold + 0.1, brightness);
  color = bloom;

  // 点滅
  // color *= step(0.0, sin(fullScreenUv.y * 5.0 - uTime * 2.0 * noise)) * 0.05 + 0.98;

  //走査線（画面全体）
  // color *= step(0.0, sin(fullScreenUv.y * 4.0 - uTime * 0.9)) * 0.05 + 0.98;

	// 走査線（シングル）
  // color *= 0.98 - sin(fullScreenUv.y * 200.0 - uTime * 100.0) * 0.01;

	// ----------ヴィネット---------
  float vignetProgress = map(uLoadingTransition, 0.0, 0.5, 0.0, 1.0, true);

  float vignetEdge = 0.25;

  vignetEdge = clamp(vignetEdge, 0.0, 1.0);

  vignetEdge *= uAspect;//アスペクト比を考慮
  vignetEdge *= 1.00;//大きさを調整
  float offset = 0.98;//ぼかしの範囲

  vignetEdge += vignetProgress;

  color *= (1.0 - smoothstep(vignetEdge - offset, vignetEdge, length(adjustedUv - 0.5)));

  // color = vec3(vignetEdge);

  //ブライトネス
  // color = vec3(brightness);

  //ブラー
  // color = blur(tDiffuse, uv, uResolution, uRadius, 2);
  // color += blur(tDiffuse, uv, uResolution, uRadius, 2);

  //グレースケール
  // color = grayScale(color);

  //------ガンマ補正------
  color = pow(color, vec3(2.2));
  color = gammaCorrect(color, uGamma);
  color = linearToSRGB(color);

  gl_FragColor = vec4(color.rgb, texColor.a);
}