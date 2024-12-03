float getTickedTime(float time, float delta) {
  float garbage = mod(time, delta);
  return time - garbage;
}

#pragma glslify: export(getTickedTime);
