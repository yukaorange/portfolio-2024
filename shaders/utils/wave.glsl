float wave(float x, float y) {
  return sin(10.0 * x + 10.0 * y) / 5.0 +
    sin(20.0 * x + 15.0 * y) / 3.0 +
    sin(4.0 * x + 10.0 * y) / -4.0 +
    sin(y) / 2.0 +
    sin(x * x * y * 20.0) +
    sin(x * 20.0 + 4.0) / 5.0 +
    sin(y * 30.0) / 5.0 +
    sin(x) / 4.0;

}

#pragma glslify: export(wave);