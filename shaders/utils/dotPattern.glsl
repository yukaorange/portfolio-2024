vec3 dotPattern(vec2 uv, vec3 color) {
  const float dotSpace = 0.04;
  const float dotSize = 0.02; 

    // ドットの中心位置を計算
  vec2 center = floor(uv / dotSpace) * dotSpace + (dotSpace * 0.5);

    // 現在の位置とドット中心との距離
  vec2 dist = abs(uv - center);

    // ドットパターンの強度を計算
  vec2 dots = smoothstep(dotSize, 0.0, dist);

  float pattern = dots.x * dots.y;

  return color * pattern;
}

#pragma glslify: export(dotPattern)
