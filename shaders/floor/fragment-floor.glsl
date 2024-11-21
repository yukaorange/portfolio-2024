varying vec2 vUv;
varying vec3 vNormal;

// uniform float uTime;

// uniform vec2 uResolution;
// uniform vec2 uTextureResolution;
uniform vec3 uColor;
uniform sampler2D uRoughness;
uniform sampler2D uNormal;

void main() {
  vec2 uv = vUv;
  vec3 normal = normalize(vNormal);

  vec3 roughness = texture2D(uRoughness, uv).rgb;
  vec3 normalMap = texture2D(uNormal, uv).rgb;

  vec3 color = vec3(uv, 0.0);

  color = uColor;

  color = mix(color, color * roughness, 0.5);
  color = mix(color, color * normalMap, 0.3);
  
  gl_FragColor = vec4(color, 1.0);

}