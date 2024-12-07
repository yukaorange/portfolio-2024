#pragma glslify: export(linear)
float linear(float t) {
  return t;
}

#pragma glslify: export(easeInQuad)
float easeInQuad(float t) {
  return t * t;
}

#pragma glslify: export(easeOutQuad)
float easeOutQuad(float t) {
  return -t * (t - 2.0);
}

#pragma glslify: export(easeInOutQuad)
float easeInOutQuad(float t) {
  return t < 0.5 ? 2.0 * t * t : 1.0 - pow(-2.0 * t + 2.0, 2.0) / 2.0;
}

#pragma glslify: export(easeInCubic)
float easeInCubic(float t) {
  return t * t * t;
}

#pragma glslify: export(easeOutCubic)
float easeOutCubic(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

#pragma glslify: export(easeInOutCubic)
float easeInOutCubic(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

#pragma glslify: export(easeInQuart)
float easeInQuart(float t) {
  return t * t * t * t;
}

#pragma glslify: export(easeOutQuart)
float easeOutQuart(float t) {
  return 1.0 - pow(1.0 - t, 4.0);
}

#pragma glslify: export(easeInOutQuart)
float easeInOutQuart(float t) {
  return t < 0.5 ? 8.0 * t * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 4.0) / 2.0;
}

#pragma glslify: export(easeInExpo)
float easeInExpo(float t) {
  return t == 0.0 ? 0.0 : pow(2.0, 10.0 * t - 10.0);
}

#pragma glslify: export(easeOutExpo)
float easeOutExpo(float t) {
  return t == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * t);
}

#pragma glslify: export(easeInOutExpo)
float easeInOutExpo(float t) {
  return t == 0.0 ? 0.0 : t == 1.0 ? 1.0 : t < 0.5 ? pow(2.0, 20.0 * t - 10.0) / 2.0 : (2.0 - pow(2.0, -20.0 * t + 10.0)) / 2.0;
}

#pragma glslify: export(easeInSine)
float easeInSine(float t) {
  return 1.0 - cos((t * 3.14159) / 2.0);
}

#pragma glslify: export(easeOutSine)
float easeOutSine(float t) {
  return sin((t * 3.14159) / 2.0);
}

#pragma glslify: export(easeInOutSine)
float easeInOutSine(float t) {
  return -(cos(3.14159 * t) - 1.0) / 2.0;
}

#pragma glslify: export(easeInCirc)
float easeInCirc(float t) {
  return 1.0 - sqrt(1.0 - pow(t, 2.0));
}

#pragma glslify: export(easeOutCirc)
float easeOutCirc(float t) {
  return sqrt(1.0 - pow(t - 1.0, 2.0));
}

#pragma glslify: export(easeInOutCirc)
float easeInOutCirc(float t) {
  return t < 0.5 ? (1.0 - sqrt(1.0 - pow(2.0 * t, 2.0))) / 2.0 : (sqrt(1.0 - pow(-2.0 * t + 2.0, 2.0)) + 1.0) / 2.0;
}

#pragma glslify: export(easeInElastic)
float easeInElastic(float t) {
  float c4 = (2.0 * 3.14159) / 3.0;
  return t == 0.0 ? 0.0 : t == 1.0 ? 1.0 : -pow(2.0, 10.0 * t - 10.0) * sin((t * 10.0 - 10.75) * c4);
}

#pragma glslify: export(easeOutElastic)
float easeOutElastic(float t) {
  float c4 = (2.0 * 3.14159) / 3.0;
  return t == 0.0 ? 0.0 : t == 1.0 ? 1.0 : pow(2.0, -10.0 * t) * sin((t * 10.0 - 0.75) * c4) + 1.0;
}

#pragma glslify: export(easeInOutElastic)
float easeInOutElastic(float t) {
  float c5 = (2.0 * 3.14159) / 4.5;
  return t == 0.0 ? 0.0 : t == 1.0 ? 1.0 : t < 0.5 ? -(pow(2.0, 20.0 * t - 10.0) * sin((20.0 * t - 11.125) * c5)) / 2.0 : (pow(2.0, -20.0 * t + 10.0) * sin((20.0 * t - 11.125) * c5)) / 2.0 + 1.0;
}

#pragma glslify: export(easeInBack)
float easeInBack(float t) {
  float c1 = 1.70158;
  float c3 = c1 + 1.0;
  return c3 * t * t * t - c1 * t * t;
}

#pragma glslify: export(easeOutBack)
float easeOutBack(float t) {
  float c1 = 1.70158;
  float c3 = c1 + 1.0;
  return 1.0 + c3 * pow(t - 1.0, 3.0) + c1 * pow(t - 1.0, 2.0);
}

#pragma glslify: export(easeInOutBack)
float easeInOutBack(float t) {
  float c1 = 1.70158;
  float c2 = c1 * 1.525;
  return t < 0.5 ? (pow(2.0 * t, 2.0) * ((c2 + 1.0) * 2.0 * t - c2)) / 2.0 : (pow(2.0 * t - 2.0, 2.0) * ((c2 + 1.0) * (t * 2.0 - 2.0) + c2) + 2.0) / 2.0;
}

#pragma glslify: export(easeOutBounce)
float easeOutBounce(float t) {
  float n1 = 7.5625;
  float d1 = 2.75;

  if(t < 1.0 / d1) {
    return n1 * t * t;
  } else if(t < 2.0 / d1) {
    t -= 1.5 / d1;
    return n1 * t * t + 0.75;
  } else if(t < 2.5 / d1) {
    t -= 2.25 / d1;
    return n1 * t * t + 0.9375;
  } else {
    t -= 2.625 / d1;
    return n1 * t * t + 0.984375;
  }
}

#pragma glslify: export(easeInBounce)
float easeInBounce(float t) {
  return 1.0 - easeOutBounce(1.0 - t);
}

#pragma glslify: export(easeInOutBounce)
float easeInOutBounce(float t) {
  return t < 0.5 ? (1.0 - easeOutBounce(1.0 - 2.0 * t)) / 2.0 : (1.0 + easeOutBounce(2.0 * t - 1.0)) / 2.0;
}