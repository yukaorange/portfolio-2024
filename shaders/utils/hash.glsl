float hash(vec2 p) {
  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
}

float hash(float n) {
  return fract(sin(n) * 1031.1977 + sin(n * 2.3437) * 43758.5453123);
}

#pragma glslify: export(hash);
