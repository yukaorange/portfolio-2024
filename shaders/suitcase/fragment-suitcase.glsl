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
uniform sampler2D uEffectTexture;

#pragma glslify: fresnel = require('../utils/fresnel.glsl');
#pragma glslify: radialRainbow = require('../utils/radialRainbow.glsl');

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

  //虹色
  vec4 rainbow = radialRainbow(fragCoord, uTime * 0.1);

  //----------エッジ検出と色の作成----------

  vec3 dx = dFdx(normalColor);
  vec3 dy = dFdy(normalColor);

  float edgeIntensity = length(dx) + length(dy);

  edgeIntensity = smoothstep(0.0, 1.0, edgeIntensity * 10.0);

  //エッジカラー作成
  vec3 edgeColor = rainbow.rgb * edgeIntensity * 0.64;

  //----------最終出力の決定----------
  vec3 color;

  if(uIsScrollEnd == 1.0) {
    color = mix(edgeColor, vec3(fresnelValue) + textureColor + vec3(fresnelValue * rainbow.r * 0.162 * 0.4, fresnelValue * rainbow.g * 0.22 * 0.4, fresnelValue * rainbow.b * 0.08 * 0.4), fresnelValue);//フレネルの値が高い部分（反射が強い部分）は、なんちゃってゲーミングデバイスの光を出している。
  } else {
    color = textureColor;
  }

  gl_FragColor = vec4(color, 1.0);

}