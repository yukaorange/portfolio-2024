varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;

  vNormal = normalize(normalMatrix * normal);

  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  vec4 viewPosition = viewMatrix * worldPosition;

  gl_Position = projectionMatrix * viewPosition;
}