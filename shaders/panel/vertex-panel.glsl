uniform float uAspect;
uniform float uTime;
uniform float uTotalWidth;
uniform float uTotalHeight;
varying float vIndex;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vInstacePosition;

#define PI 3.1415926535897932384626433832795

void main() {
  float instanceId = float(gl_InstanceID);

  vIndex = instanceId;

  vUv = uv;

  vNormal = normalize(normalMatrix * normal);

  vec4 instancePosition = instanceMatrix * vec4(position, 1.0);
  vInstacePosition = instancePosition.xyz;

  vec4 worldPosition = modelMatrix * instancePosition;

  worldPosition.z -= sin(worldPosition.x / uTotalWidth * PI + PI / 2.) * 3.5;

  vWorldPosition = worldPosition.xyz;

  vec4 viewPosition = viewMatrix * worldPosition;

  gl_Position = projectionMatrix * viewPosition;
}