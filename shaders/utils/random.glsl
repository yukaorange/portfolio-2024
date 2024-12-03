//パフォーマンス重視の一般的な乱数生成
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float rand(float t) {
  return fract(sin(dot(vec2(t, t), vec2(12.9898, 78.233))) * 43758.5453123);
}


#pragma glslify: export(rand);