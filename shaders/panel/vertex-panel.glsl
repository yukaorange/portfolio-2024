uniform float uTime;
uniform float uTotalWidth;
varying float vIndex;
varying float vInvert;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vInstacePosition;

uniform sampler2D uNoiseTexture;

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

  //----------汎用ノイズ------------
  vec2 noise = texture2D(uNoiseTexture, vec2(uTime * 0.03 + modelMatrix[3][0])).xy;
  vec2 noiseHigh = texture2D(uNoiseTexture, vec2(uTime * 3.0 + modelMatrix[3][0])).xy;

  vInvert = step(0.5, noise.y + noiseHigh.y * 0.08);
}