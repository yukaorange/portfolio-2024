float stripe(vec2 uv, float width) {

  float sectionLower = 1.0 / 3.0;
  float sectionUpper = 2.0 / 3.0;
  float isMiddleSection = step(sectionLower, uv.y) * step(uv.y, sectionUpper);

  float PI = 3.1415926535897932384626433832795;

  float stripeWidth = width;

  float angle = 25.0;

  float rad = angle * PI / 180.0;

  //左右反転
  uv.x = 1.0 - uv.x;

  //矢印っぽくなる
  if(uv.y < 0.5) {
    uv.y = 1.0 - uv.y;
  }

  //フツーにステップにしたら縦じまになるところ、glslRotateを使って回転させることで斜めストライプにする
  float rotatePos = uv.x * cos(rad) - uv.y * sin(rad);

  float pattern = smoothstep(0.49, 0.51, fract(rotatePos / stripeWidth));

  pattern *= isMiddleSection;

  return pattern;

}

#pragma glslify:export(stripe);