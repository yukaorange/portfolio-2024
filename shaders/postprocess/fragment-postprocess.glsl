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
#pragma glslify: linearToSRGB = require('../utils/linerToSRGB.glsl');

float getLuminance(vec3 color) {
  return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

vec3 blur(sampler2D tex, vec2 uv, vec2 res, float radius) {
  vec2 texelSize = 1.0 / res;

  vec3 result = vec3(0.0);

  float total = 0.0;

  for(int x = -2; x <= 2; x++) {
    for(int y = -2; y <= 2; y++) {

      vec2 offset = vec2(float(x), float(y)) * texelSize * radius;

      float weight = 1.0 - length(vec2(x, y)) * 0.2;

      if(weight <= 0.0)
        continue;

      result += texture2D(tex, uv + offset).rgb * weight;

      total += weight;
    }
  }

  return result / total;
}

void main() {
  vec2 uv = vUv;
  vec3 color;

  vec4 texColor = texture2D(tDiffuse, uv);

  color = texColor.rgb;

  //------低負荷ブルームエフェクト------
  vec3 blurred = blur(tDiffuse, uv, uResolution, uRadius);

  float brightness = getLuminance(blurred);

  brightness = brightness > uThreshold ? 1.0 : 0.0;

  vec3 blend = color + blurred * uStrength * step(uThreshold, brightness);
  color = blend;

  // float vignetteAmount = 1.0 - length(uv - vec2(0.5)) * uOffset;

  // vignetteAmount = smoothstep(0.8 - uOffset * 0.8, 0.8 + uOffset * 0.5, vignetteAmount);

  // color = mix(color, color * vignetteAmount, uDarkness);

  //------ガンマ補正------
  color = pow(color, vec3(2.2));
  color = gammaCorrect(color, uGamma);
  color = linearToSRGB(color);

  gl_FragColor = vec4(color.rgb, texColor.a);
}