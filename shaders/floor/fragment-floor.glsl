varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

// uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uRoughness;
uniform sampler2D uNormal;
uniform vec3 uLightPositions[3];
uniform vec3 uLightColors[3];
uniform float uLightIntensities[3];

void main() {
  vec2 uv = vUv;

  vec3 normal = texture2D(uNormal, uv).rgb * 2.0 - 1.0;

  float roughness = texture2D(uRoughness, uv).r;

  vec3 viewDir = normalize(cameraPosition - vWorldPosition);

  //light power
  vec3 totalLight;
  for(int i = 0; i < 3; i++) {
    //ライトの方向と色
    vec3 lightDir = normalize(uLightPositions[i] - vWorldPosition);
    vec3 lightColor = uLightColors[i];

    //距離による減衰
    float distance = length(uLightPositions[i] - vWorldPosition);
    float attenuation = 1.0 / (1.0 + 0.09 * distance + 0.032 * distance * distance);

    //diffuseとspecular
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 halfwayDir = normalize(lightDir + viewDir);//光源と視線のハーフベクトルは、光源と視線の中間の方向を向いており、光源と視線の角度の平均を表している。
    float spec = pow(max(dot(normal, halfwayDir), 0.0), 18.0);//法線とハーフベクトルの内積を取ることで、光源と視線の角度の平均を表すスペキュラーを計算できる。角度が水平に近いときにスペキュラーが強くなる。べき乗の値を大きくすると、スペキュラーが小さくなり、より輝きの範囲をしぼることができる。

    // totalLight += diff;//test diff only
    // totalLight += spec;//test spec only
    // totalLight += attenuation;//test attenuation only

    totalLight += (diff + spec * (1.0 - roughness)) * lightColor * attenuation * uLightIntensities[i];
  }

  vec3 color = vec3(1.0, 1.0, 1.0);
  color *= totalLight;
  color = mix(color, color * roughness, 0.5);

  gl_FragColor = vec4(color, 1.0);

}