float quakeRandom(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float calculateSliceOffset(float slice_y, float time, float intensity) {
  
  float quakeRandomValue = quakeRandom(vec2(slice_y, time));

    // -1.0 から 1.0 の範囲に変換
  return (quakeRandomValue * 2.0 - 1.0) * intensity;
}

float quake(float y, float count, float time, float intensity) {

  float currentSlice = floor(y * count);

  float nextSlice = currentSlice + 1.0;

  float positionY = fract(y * count);

  float currentOffset = calculateSliceOffset(currentSlice, time, intensity);

  float nextOffset = calculateSliceOffset(nextSlice, time, intensity);

  float t = positionY;

  // スムースステップを再現（なみなみに分ける）
  // t = t * t * (3.0 - 2.0 * t);

  //パきっと分ける
  t = step(0.5, t);

    // 二つのオフセットを補間
  return mix(currentOffset, nextOffset, t);
}

#pragma glslify:export(quake);
