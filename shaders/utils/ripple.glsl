float easeOutQuad(float t) {
  t = clamp(t, 0.0, 1.0);
  float reversedT = 1.0 - t;
  return 1.0 - (reversedT * reversedT * reversedT * reversedT);
}

vec3 ripple(vec2 uv, float time) {
  float RIPPLE_SPEED = 0.4;
  float RIPPLE_PEAK = 0.3;

  vec2 center = vec2(0.5);
  float dist = length(uv - center);

    // 時間に基づいて波紋の年齢を計算
  float age = mod(time * RIPPLE_SPEED + 0.5, 1.0);

    // 波紋のサイズを計算
  float size = easeOutQuad(age);
  float innerSize = size * 0.25;
  float outerSize = size;

  float gradient = 1.0;
  if(dist < innerSize) {
    gradient = smoothstep(0.0, innerSize, dist);
  } else if(dist < outerSize) {
    gradient = smoothstep(outerSize, innerSize, dist);
  } else {
    gradient = 0.0;
  }

    // アルファ値の計算
  float alpha = age < RIPPLE_PEAK ? easeOutQuad(age / RIPPLE_PEAK) : 1.0 - ((age - RIPPLE_PEAK) / (1.0 - RIPPLE_PEAK));

    // 波紋の強度を計算
  float rippleStrength = gradient * alpha * 0.5;

  rippleStrength *= smoothstep(size + 0.01, size, mod(time, 1.0));

  rippleStrength *= alpha;

  rippleStrength *= 0.1;

  vec3 rippleLine = vec3(rippleStrength);

  return rippleLine;
}

#pragma glslify: export(ripple);
