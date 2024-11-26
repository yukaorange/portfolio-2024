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

  //各色の強度を調整
  float redIntensity = 0.72;
  float greenIntensity = 0.96;
  float blueIntensity = 0.48;

  //３段階
  color.r = color.r * redIntensity * (step(1.0, (judgeLessThan(uvStep.x, 1.0) + judgeLessThan(uvStep.y, 1.0))));

  color.g = color.g * greenIntensity * step(1.0, (between(uvStep.x, 1.0, 2.0) + between(uvStep.y, 1.0, 2.0)));

  color.b = color.b * blueIntensity * step(1.0, (judgeGreaterEqual(uvStep.x, 2.0) + judgeGreaterEqual(uvStep.y, 2.0)));

  color = mix(color, vec3(dot(color, vec3(0.299, 0.587, 0.114))), 0.16); //モノクロに寄せる

  return color * brightness;
}

// エクスポート用
#pragma glslify: export(crtEffect)