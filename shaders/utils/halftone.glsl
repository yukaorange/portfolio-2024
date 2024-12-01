// RGBからHSVに変換する関数
// HSVのValue（明るさ）成分を使用してハーフトーンの強度を決定するために必要
vec3 rgb2hsv(vec3 tex) {
    // 入力されたRGB値をコピー
  vec3 c = tex;
    // HSV変換に必要な定数ベクトル
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    // RGB値の大小関係に基づいて中間値を計算
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    // HSVのSaturation計算のための差分
  float d = q.x - min(q.w, q.y);
    // 0除算を防ぐための極小値
  float e = 1.0e-10;
    // HSV値を返す：H（色相）、S（彩度）、V（明るさ）
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// tDiffuse: 入力テクスチャ
// uv: テクスチャ座標
// resolution: テクスチャの解像度（幅、高さ）
// size: ドットパターンの密度
// dotSize: 各ドットの大きさ
// valueMult: 明るさの乗数
// invert: パターンの反転フラグ
vec4 halftone(sampler2D tDiffuse, vec2 uv, vec2 resolution, float size, float dotSize, float valueMult, bool invert) {
    // intのsizeをfloatに変換（GLSLでの計算のため）

  vec2 texelSize = 1.0 / resolution;

  // アスペクト比の補正値を計算、非正方形テクスチャでもドットが歪まない
  vec2 ratio = vec2(1.0, texelSize.x / texelSize.y);

  // uvを量子化してピクセル化効果を作成
   // floor関数で小数点以下を切り捨て、一定サイズのグリッドを作る
  vec2 pixelatedUv = floor(uv * size * ratio) / (size * ratio);

  // length関数で距離を計算し、円形のドットを作成
  float dots = length(fract(uv * size * ratio) - vec2(0.5)) * dotSize;

  // テクスチャから色を取得し、HSVに変換して明るさ（V）成分を抽出
  float value = rgb2hsv(texture2D(tDiffuse, pixelatedUv).rgb).z;

   // パターンの反転処理
  // invert引数に基づいて通常/反転パターンを選択
  dots = mix(dots, 1.0 - dots, float(invert));

  // 明るさに基づいてドットの大きさを調整
  // 明るい部分ではドットが小さく、暗い部分では大きくなる
  dots += value * valueMult;

  // ドットのエッジを調整
  // pow関数でエッジをシャープにしつつ、アンチエイリアシングも維持
  dots = pow(dots, 5.0);

  // 最終的な値を0-1の範囲に制限
  // これにより、異常な値による表示の乱れを防ぐ
  dots = clamp(dots, 0.0, 1.0);

  return vec4(vec3(dots), texture2D(tDiffuse, uv).a);
}

#pragma glslify: export(halftone);
