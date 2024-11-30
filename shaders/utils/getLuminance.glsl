float getLuminance(vec3 color) {

  //The coefficients (0.2126, 0.7152, 0.0722) are the standard weights for converting RGB to luminance.
  //この一般的に輝度を図るために使われる係数。
  //たとえば、この内積をvec3()で出力すれば、明るい部分だけを抽出することができる。
  //ex : brightness = brightness > Threshold ? 1.0 : 0.0;


  return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

#pragma glslify: export(getLuminance);
