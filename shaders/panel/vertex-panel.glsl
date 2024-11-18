uniform float uAspect;
attribute float aIndex;
varying float vIndex;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vInstacePosition;

void main() {
  vIndex = aIndex;

  vUv = uv;

  vNormal = normalize(normalMatrix * normal);

  vec4 instancePosition = instanceMatrix * vec4(position, 1.0);
  vInstacePosition = instancePosition.xyz;

  vec4 worldPosition = modelMatrix * instancePosition;
  vWorldPosition = worldPosition.xyz;

  vec4 viewPosition = viewMatrix * worldPosition;

  gl_Position = projectionMatrix * viewPosition;
}