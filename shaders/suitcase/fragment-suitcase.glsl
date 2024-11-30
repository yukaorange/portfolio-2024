varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vLightDirection;
varying vec3 vEyeVector;

uniform float uTime;
uniform float uAspect;
uniform float uIsScrollEnd;
uniform float uTransition;
uniform float uDiffuseness;
uniform float uRefractPower;
uniform float uShininess;
uniform float uFresnelPower;
uniform float uIorR;
uniform float uIorY;
uniform float uIorG;
uniform float uIorC;
uniform float uIorB;
uniform float uIorP;
uniform float uGridCount;

uniform vec2 uResolution;
uniform sampler2D uTexture;

#pragma glslify: optimizationTextureUv = require('../utils/optimizeUv.glsl');
#pragma glslify: fresnel = require('../utils/fresnel.glsl');
#pragma glslify: radialRainbow = require('../utils/radialRainbow.glsl');
#pragma glslify: createGrid = require('../utils/grid.glsl');
#pragma glslify: specular = require('../utils/specular.glsl');
#pragma glslify: hash = require('../utils/hash.glsl');

vec2 applyRefraction(vec2 coord, vec3 refractVec, float strength) {
  return coord + refractVec.xy * strength;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy / uResolution.xy;

  vec2 uv = vUv;
  vec2 suitcaseUv = vec2(uv.x, 1.0 - uv.y);
  vec3 normal = normalize(vNormal);

  //----------反射、フレネル----------

  //フレネル反射値を取得
  float fresnelValue = fresnel(vEyeVector, vNormal, uFresnelPower);

  float speclarValue = specular(vLightDirection, vNormal, vEyeVector, uShininess, uDiffuseness);

  //----------ユーティリティカラー---------
  //法線カラー
  vec3 normalColor = vec3(normal);

  //テクスチャ
  vec3 textureColor = texture2D(uTexture, suitcaseUv).rgb;

  //ノイズ
  float hashValue = hash(suitcaseUv + mod(uTime, 1.0) + 214.0) * 0.7;
  vec3 noiseColor = vec3(hashValue);
  noiseColor *= 0.3;

  //虹色
  vec4 rainbow = radialRainbow(fragCoord, uTime) * 0.1;

  //----------エッジ検出と色の作成----------

  vec3 dx = dFdx(normalColor);
  vec3 dy = dFdy(normalColor);

  float edgeIntensity = length(dx) + length(dy);

  edgeIntensity = smoothstep(0.0, 1.0, edgeIntensity * 10.0);

  //エッジカラー作成
  vec3 edgeColor = rainbow.rgb * edgeIntensity * 0.64;

  //-----------屈折エフェクトの作成----------
  //グリッド線画面用の座標
  vec2 coordGrid = vec2(fragCoord.x * uAspect, fragCoord.y);

  vec3 refractVecR = refract(vEyeVector, normal, (1.0 / uIorR));
  vec3 refractVecG = refract(vEyeVector, normal, (1.0 / uIorG));
  vec3 refractVecB = refract(vEyeVector, normal, (1.0 / uIorB));
  vec3 refractVecY = refract(vEyeVector, normal, (1.0 / uIorY));
  vec3 refractVecC = refract(vEyeVector, normal, (1.0 / uIorC));
  vec3 refractVecP = refract(vEyeVector, normal, (1.0 / uIorP));

  vec3 gridColor = vec3(0.0);

  const int LOOP = 2;

  // vec2 coordR = applyRefraction(coordGrid, refractVecR, uRefractPower);
  // vec2 coordG = applyRefraction(coordGrid, refractVecG, uRefractPower);
  // vec2 coordB = applyRefraction(coordGrid, refractVecB, uRefractPower);

  // vec3 gridColorR = createGrid(coordR, vec2(uGridCount), uTime);
  // vec3 gridColorG = createGrid(coordG, vec2(uGridCount), uTime);
  // vec3 gridColorB = createGrid(coordB, vec2(uGridCount), uTime);

  // vec3 gridColor = vec3(gridColorR.r, gridColorG.g, gridColorB.b); 

  for(int i = 0; i < LOOP; i++) {
    float slide = float(i) / float(LOOP) * 0.1;

    vec2 coordR = applyRefraction(coordGrid, refractVecR, uRefractPower + slide);
    vec2 coordG = applyRefraction(coordGrid, refractVecG, uRefractPower + slide * 2.0);
    vec2 coordB = applyRefraction(coordGrid, refractVecB, uRefractPower + slide * 3.0);

    vec2 coordY = applyRefraction(coordGrid, refractVecY, uRefractPower + slide);
    vec2 coordC = applyRefraction(coordGrid, refractVecC, uRefractPower + slide * 2.5);
    vec2 coordP = applyRefraction(coordGrid, refractVecP, uRefractPower + slide);

    vec3 gridR = createGrid(coordR, vec2(uGridCount), uTime);
    vec3 gridG = createGrid(coordG, vec2(uGridCount), uTime);
    vec3 gridB = createGrid(coordB, vec2(uGridCount), uTime);
    vec3 gridY = createGrid(coordY, vec2(uGridCount), uTime);
    vec3 gridC = createGrid(coordC, vec2(uGridCount), uTime);
    vec3 gridP = createGrid(coordP, vec2(uGridCount), uTime);

    float r = gridR.r * 0.5;
    float g = gridG.g * 0.5;
    float b = gridB.b * 0.5;

    float y = (gridY.r * 2.0 + gridY.g * 2.0 - gridY.b) / 6.0;
    float c = (gridC.r * 2.0 + gridC.g * 2.0 - gridC.b) / 6.0;
    float p = (gridP.r * 2.0 + gridP.g * 2.0 - gridP.b) / 6.0;

    gridColor.r += r + (2.0 * p + 2.0 * y - c) / 3.0;
    gridColor.g += g + (2.0 * y + 2.0 * c - p) / 3.0;
    gridColor.b += b + (2.0 * c + 2.0 * p - y) / 3.0;
  }

  gridColor /= float(LOOP);

  //----------最終出力の決定----------
  vec3 color;

  vec3 endPositionColor;

  endPositionColor = edgeColor;

  endPositionColor += fresnelValue;

  endPositionColor += speclarValue * 0.16;

  endPositionColor += vec3(gridColor);

  color = mix(textureColor, endPositionColor, uIsScrollEnd);

  color = mix(color, noiseColor, uTransition);

  gl_FragColor = vec4(color, 1.0);

}