varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vLightDirection;
varying vec3 vEyeVector;

uniform float uTime;
uniform float uIsScrollEnd;
uniform float uFrasnelBias;
uniform vec2 uResolution;
// uniform vec2 uTextureResolution;
uniform sampler2D uTexture;

#pragma glslify: fresnel = require('../utils/fresnel.glsl');

void main() {
  vec2 fragCoord = gl_FragCoord.xy / uResolution.xy;

  vec2 uv = vUv;
  vec2 suitcaseUv = vec2(uv.x, 1.0 - uv.y);
  vec3 normal = normalize(vNormal);

  //フレネル反射値を取得
  float fresnelValue = fresnel(vEyeVector, vNormal, uFrasnelBias);

  //ベースとなる色
  vec3 textureColor = texture2D(uTexture, suitcaseUv).rgb;
  //法線カラー
  vec3 normalColor = vec3(normal);

  //----------エッジ検出----------

  vec3 dx = dFdx(normalColor);
  vec3 dy = dFdy(normalColor);
  float edgeIntensity = length(dx) + length(dy);
  edgeIntensity = smoothstep(0.0, 1.0, edgeIntensity * 4.0);

  //----------最終出力の決定----------
  vec3 color;

  if(floor(uIsScrollEnd) == 1.0) {
    color = vec3(fresnelValue);
  } else {
    color = textureColor;
  }

  vec3 test;

  test = vec3(edgeIntensity + fresnelValue);

  color = test;

  gl_FragColor = vec4(color, 1.0);

}