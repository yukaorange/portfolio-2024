float pixelTransition(vec2 fullScreenUv, float scrollEndProgress) {

  float squares = 8.0;

  vec2 cell = floor(fullScreenUv * squares); // 各セルの位置を特定
  vec2 cellCenter = (cell + 0.5) / squares; // 各セルの中心点を計算

  float distFromCenter = length(cellCenter - vec2(0.5, 0.5));

  float normalizedDist = distFromCenter / (length(vec2(0.5, 0.5)));

  normalizedDist = 1.0 - distFromCenter;

  normalizedDist *= 2.0;

  float mask = normalizedDist * scrollEndProgress;

  float minIntensity = 0.1 * clamp(scrollEndProgress, 0.0, 1.0);

  mask = mask + minIntensity;

  return step(0.98, mask);
}

#pragma glslify:export(pixelTransition);
