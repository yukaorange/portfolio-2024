// 点Pから線分(P0-P1)までの最短距離を計算する関数
float segment(vec2 P, vec2 P0, vec2 P1) {
  //p0:端点0
  //p1:端点1
  //p:任意の点

  vec2 v = P1 - P0;//端点どうしの線分ベクトル

  vec2 w = P - P0;//端点0と任意の点の線分ベクトル

  //線分上の最近接点を求める
  float b = dot(w, v) / dot(v, v);

  v *= clamp(b, 0.0, 1.0);

// 点Pと線分上の最近接点との距離を返す
  return distance(w, v);
}

float calculateAmplitude(float position, float scale, float time) {
    // 1. エッジフェード係数の計算
  float normalizedPosition = position / scale;  // 位置を正規化

  float shiftedPosition = normalizedPosition + 0.1;  // 少し右にシフト

  float fadeFactorAtEdges = clamp(shiftedPosition, 0.0, 1.0);  // 0-1の範囲に制限

    // 2. 基本波形の生成
  float baseWave = sin(position + time);  // 時間変化する基本の波

    // 3. ノイズ的な変動の追加
  float highFrequencyWave = baseWave * 100000.0;  // 高周波化
  float noisyWave = fract(highFrequencyWave);  // 0-1の範囲の不規則な波

    // 4. 波形の中央化
  float centeredWave = (noisyWave - 0.5);  // -0.5から0.5の範囲に

    // 5. エッジでのフェードアウト適用
  float edgeFactor = fadeFactorAtEdges * (1.0 - fadeFactorAtEdges);

  float fadedWave = centeredWave * edgeFactor;

    // 6. 最終的な大きさの調整
  // float finalWave = fadedWave * scale;
  float finalWave = fadedWave * scale;

  return finalWave;
}

vec3 cardiogram(
  vec2 pixelPosition, // 描画する画面上の位置
  float time,
  vec2 resolution
) {
  // 1. 基本設定
  float scale = 30.0;

    // 画面座標をスケーリング
  vec2 scaledPosition = pixelPosition * scale;

  // 2. 波形の3点を計算
    // 最初の点の位置
  float xPos = floor(scaledPosition.x) - 0.5;

  vec2 point0 = vec2(xPos, calculateAmplitude(xPos, scale, time));

    // 次の点の位置
  xPos += 1.0;

  vec2 point1 = vec2(xPos, calculateAmplitude(xPos, scale, time));

    // さらに次の点の位置
  xPos += 1.0;
  vec2 point2 = vec2(xPos, calculateAmplitude(xPos, scale, time));

    // 3. 線分との距離を計算
  float distance1 = segment(scaledPosition, point0, point1);

  float distance2 = segment(scaledPosition, point1, point2);

    // 2つの線分の最短距離を取る
  float minDistance = min(distance1, distance2);

  // 4. 波形のエフェクト計算
    // メインラインのアンチエイリアス
  float lineEdge = clamp(max(minDistance - 0.2, 0.0) * scale, 0.0, 1.0);

    // グロー効果
  float glowEffect = clamp(max(abs(minDistance - 0.2) - 0.05, 0.0) * scale, 0.0, 4.0);

  // 5. 背景グリッドの計算
  vec2 gridPos = abs(mod(scaledPosition, vec2(1.0)) - vec2(0.5)) - 0.01;

  float gridIntensity = clamp(min(gridPos.x, gridPos.y) * resolution.x / scale, 0.0, 1.0);

  // 6. 最終的な色の計算
  vec3 backgroundColor = vec3((1.0 - gridIntensity) * 0.2 + 0.2) * 0.02;

  float colorIntensity = 0.56;

  vec3 waveColor = vec3(glowEffect * colorIntensity, glowEffect * colorIntensity, glowEffect * colorIntensity);

  return mix(backgroundColor, waveColor, (1.0 - lineEdge));
}
#pragma glslify: export(cardiogram);