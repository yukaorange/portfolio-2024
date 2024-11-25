vec3 cardiogram(
  vec2 pixelPosition,// ピクセル位置
  vec2 resolution,// 画面解像度
  float time
) {
  vec2 uv = pixelPosition;
  uv -= 0.5;
  uv *= 2.0;

  vec2 lightUV = uv;

    // 2. ライトの移動効果の計算
  lightUV.x -= 3.0 * mod(time, 1.0 * resolution.x / resolution.y);

    // ライトの強度計算
  float lightIntensity = -(1.0 / (30.0 * lightUV.x));

  vec3 lightColor = vec3(lightIntensity, lightIntensity, lightIntensity);

  lightColor *= 10.0;

    // 3. 波形の計算
  float amplitude = abs(1.0 / (50.0 * max(abs(uv.x), 0.3)));

  uv.x *= 4.5;

  // フーリエ級数による波形生成
  float wave = sin(uv.x) +
    3.0 * sin(2.0 * uv.x) +
    2.0 * sin(3.0 * uv.x) +
    2.0 * sin(4.0 * uv.x);

  uv.y -= amplitude * wave;

    // 4. 波形の描画
  vec3 waveColor = mix(vec3(1.0), vec3(0.0), smoothstep(0.005, 0.01, abs(uv.y)));

  return waveColor * lightColor;
}

#pragma glslify: export(cardiogram);
