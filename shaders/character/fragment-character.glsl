varying vec2 vUv;
varying vec3 vNormal;

// uniform float uTime;

// uniform vec2 uResolution;
// uniform vec2 uTextureResolution;

uniform sampler2D uTexture;

void main() {
  vec2 uv = vUv;
  vec3 normal = normalize(vNormal);

  vec2 characterUv = vec2(uv.x, 1.0 - uv.y);

  vec3 color = texture2D(uTexture, characterUv).rgb;
  // color = vec3(normal);

  gl_FragColor = vec4(color, 1.0);

}