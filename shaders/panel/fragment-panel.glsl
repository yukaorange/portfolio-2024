uniform float uAspect;
uniform float uCount;

uniform sampler2D uTextures[10];

varying float vIndex;//1 ～ count * count
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vInstacePosition;

void main() {
  vec2 singleScreenUv = vUv;

  float totalWidth = uCount * uAspect * 2.0;
  float totalHeight = uCount * 2.0;

  float x = (vWorldPosition.x + totalWidth * 0.5) / totalWidth;

  float y = (vWorldPosition.y) / totalHeight;

  vec2 fullScreenUv = vec2(x, y);

  vec3 normal = normalize(vNormal);

  vec3 color = vec3(fullScreenUv, 0.0);

  // color = vec3(vIndex / (uCount * uCount), 0.0, 0.0);

  gl_FragColor = vec4(color, 1.0);

}