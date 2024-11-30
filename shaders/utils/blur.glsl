vec3 blur(sampler2D tex, vec2 uv, vec2 res, float radius, int range) {
  vec2 texelSize = 1.0 / res;

  vec3 result = vec3(0.0);

  float weightIntensity = 0.001;//この値を大きくすると、シャープになる。この値を小さくすると、よりソフトなぼかしになる。

  float total = 0.0;

  for(int x = -range; x <= range; x++) {
    for(int y = -range; y <= range; y++) {

      vec2 offset = vec2(float(x), float(y)) * texelSize * radius;

      float weight = 1.0 - length(vec2(x, y)) * weightIntensity;

      if(weight <= 0.0)
        continue;

      result += texture2D(tex, uv + offset).rgb * weight;

      total += weight;
    }
  }

  return result / total;
}

#pragma glslify: export(blur);
