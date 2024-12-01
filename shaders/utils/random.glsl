//パフォーマンス重視の一般的な乱数生成
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

#pragma glslify: export(rand);