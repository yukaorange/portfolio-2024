// x が value より小さい場合に1.0を返す
float judgeLessThan(float x, float value) {
  return 1.0 - step(value, x);
}

// x が lower以上 upper未満の場合に1.0を返す
float between(float x, float lower, float upper) {
  return step(lower, x) * (1.0 - step(upper, x));
}

// x が value 以上の場合に1.0を返す
float judgeGreaterEqual(float x, float value) {
  return step(value, x);
}

vec3 crtEffect(
  vec2 inputUv,     // ピクセル位置
  vec2 resolution,        // 画面解像度
  vec3 inputColor, // 入力テクスチャ
  float brightness        // 明るさ
) {
    // UV座標の計算
  vec2 uv = inputUv;

  uv.y = -uv.y;

    // ステップ計算
  vec2 uvStep;

  float devide = 3.0;

  uvStep.x = uv.x / (1.0 / resolution.x);
  uvStep.x = mod(uvStep.x, devide);

  uvStep.y = uv.y / (1.0 / resolution.y);
  uvStep.y = mod(uvStep.y, devide);

    // テクスチャから色を取得
  vec3 color = inputColor;

  //ベースの色からRGBを取り出し、
  //指定したセグメント内でのみ、そのRGBを表示する。

  //5段階を想定したセグメント
  // float segment1 = step(1.0, (judgeLessThan(uvStep.x, 0.6) + judgeLessThan(uvStep.y, 0.6)));
  // float segment2 = step(1.0, (between(uvStep.x, 0.6, 1.2) + between(uvStep.y, 0.6, 1.2)));
  // float segment3 = step(1.0, (between(uvStep.x, 1.2, 1.8) + between(uvStep.y, 1.2, 1.8)));
  // float segment4 = step(1.0, (between(uvStep.x, 1.8, 2.4) + between(uvStep.y, 1.8, 2.4)));
  // float segment5 = step(1.0, (judgeGreaterEqual(uvStep.x, 2.4) + judgeGreaterEqual(uvStep.y, 2.4)));

  // color.r = color.r * (segment1 + segment4);
  // color.g = color.g * (segment2 + segment5);
  // color.b = color.b * (segment3 + segment1); 

  //原案（３段階）
  color.r = color.r * (step(1.0, (judgeLessThan(uvStep.x, 1.0) + judgeLessThan(uvStep.y, 1.0))));

  color.g = color.g * step(1.0, (between(uvStep.x, 1.0, 2.0) + between(uvStep.y, 1.0, 2.0)));

  color.b = color.b * step(1.0, (judgeGreaterEqual(uvStep.x, 2.0) + judgeGreaterEqual(uvStep.y, 2.0)));

  return color * brightness;
}

// エクスポート用
#pragma glslify: export(crtEffect)