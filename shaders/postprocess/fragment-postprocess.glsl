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
#pragma glslify: map = require('../utils/map.glsl');
#pragma glslify: radialStrength = require('../utils/radialStrength.glsl');
#pragma glslify: linearToSRGB = require('../utils/linerToSRGB.glsl');
#pragma glslify: ripple = require('../utils/ripple.glsl');
#pragma glslify: blur = require('../utils/blur.glsl');
#pragma glslify: getLuminance = require('../utils/getLuminance.glsl');
#pragma glslify: grayScale = require('../utils/grayScale.glsl');
#pragma glslify: blendOverlay = require('../utils/blend.glsl');

void main() {
  vec2 uv = vUv;

  vec2 adjustedUv = vUv;
  adjustedUv -= 0.5;
  adjustedUv.x *= uAspect;
  adjustedUv += 0.5;

  vec3 color;

  vec4 texColor = texture2D(tDiffuse, uv);

  //----------ベースカラー--------
  color = texColor.rgb;

  //----------リップル波--------
  // vec3 rippleDiffuse = ripple(adjustedUv, uTime);

  // vec2 baseOffset = normalize(rippleDiffuse.xy) * rippleDiffuse.b + vec2(0.001);

  // vec2 redOffset = baseOffset * -0.3;
  // vec2 greenOffset = baseOffset * -0.2;
  // vec2 blueOffset = baseOffset * 0.4;

  // float alpha = rippleDiffuse.b * 0.0025;

  // vec3 red = texture2D(tDiffuse, uv + redOffset).rgb;
  // vec3 green = texture2D(tDiffuse, uv + greenOffset).rgb;
  // vec3 blue = texture2D(tDiffuse, uv + blueOffset).rgb;

  // red += alpha;
  // green += alpha;
  // blue += alpha;

  // vec3 rippleColor = vec3(red.r, green.g, blue.b);

  // color += rippleColor;

  //---------放射ディストーション-------
  float distortionProgress = map(uLoadingTransition, 0.5, 1.0, 0.0, 1.0, true);
  float distortionStrength = radialStrength(adjustedUv, 1.0, 0.04, distortionProgress);

  vec2 baseOffset = normalize(adjustedUv.xy) * distortionStrength;

  vec2 redOffset = baseOffset * -0.2;
  vec2 greenOffset = baseOffset * 0.3;
  vec2 blueOffset = baseOffset * -0.1;

  vec3 red = texture2D(tDiffuse, uv + redOffset).rgb;
  vec3 green = texture2D(tDiffuse, uv + greenOffset).rgb;
  vec3 blue = texture2D(tDiffuse, uv + blueOffset).rgb;

  color = vec3(red.r, green.g, blue.b);

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
  float vignetProgress = map(uLoadingTransition, 0.0, 0.4, 0.0, 1.0, true);

  float vignetEdge = vignetProgress;

  vignetEdge = clamp(vignetEdge, 0.0, 1.0);

  color *= (1.0 - smoothstep(vignetEdge - 0.2, vignetEdge, length(adjustedUv - 0.5)));

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