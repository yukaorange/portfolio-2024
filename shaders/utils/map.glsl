// 例1: 0-100の範囲を0.0-1.0の範囲にマッピング
//float percentage = map(75, 0, 100, 0.0, 1.0, true);
// 結果: 0.75

float map(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {
  if(clamp == true) {
    if(value < inputMin)
      return outputMin;
    if(value > inputMax)
      return outputMax;
  }

  float p = (outputMax - outputMin) / (inputMax - inputMin);

  return ((value - inputMin) * p) + outputMin;
}

#pragma glslify:export(map);