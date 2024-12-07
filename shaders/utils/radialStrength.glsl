float radialStrength(vec2 uv, float radiusCoefficient, float intensity, float time) {
  float PI = 3.14159265359;

    // 中心からの距離を計算
  vec2 center = vec2(0.5);

  float dist = length(uv - center);

    // 色収差の強度を距離に基づいて計算
    // smoothstepで中心付近は0、外側に行くほど1に近づく
  float strength = smoothstep(0.0, 0.5, dist * radiusCoefficient);

  strength *= time;

  // 任意の強度調整
  return strength * intensity;
}

#pragma glslify: export(radialStrength)