varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vEyeVector;
varying vec3 vLightDirection;

uniform vec3 uLightPosition;

void main() {
  vUv = uv;

  vNormal = normalize(normalMatrix * normal);

  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  vec4 viewPosition = viewMatrix * worldPosition;

  vEyeVector = normalize(worldPosition.xyz - cameraPosition);

  vLightDirection = normalize(uLightPosition - worldPosition.xyz);

  gl_Position = projectionMatrix * viewPosition;
}