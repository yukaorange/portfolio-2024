vec4 gridTransition(vec4 current, vec4 next, float progress, vec2 uv, float noise) {
  float squares = 8.0;

  vec2 cell = floor(uv * squares);//0.0,1.0,2.0,3.0,4.0,5.0,6.0,7.0....

  //各セルの中心
  vec2 cellCenter = (cell + 0.5) / squares;// 0.5/8.0, 1.5/8.0, 2.5/8.0, 3.5/8.0, 4.5/8.0, 5.5/8.0, 6.5/8.0, 7.5/8.0....

  //全体の中心と各セルの中心の距離をとる
  float distFromCenter = length(cellCenter - vec2(0.5, 0.5));

  distFromCenter = distFromCenter / (length(vec2(0.5, 0.5)));//中心からの距離を0.0から1.0に正規化

  float adjustedProgress = (progress * 2.0) - distFromCenter;//一番遠いところでも遷移の進行度の最大が1.0になるように調整

  adjustedProgress = clamp(adjustedProgress, 0.0, 1.0);

  float threshold = step(0.02, adjustedProgress);

  return mix(current, next, threshold);

}

#pragma glslify: export(gridTransition);
