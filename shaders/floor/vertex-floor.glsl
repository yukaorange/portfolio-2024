varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;

  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  vNormal = normalize(normalMatrix * normal);

  vWorldPosition = worldPosition.xyz;

  vec4 viewPosition = viewMatrix * worldPosition;

  gl_Position = projectionMatrix * viewPosition;
}