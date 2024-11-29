float specular(vec3 light, vec3 worldNormal, vec3 EyeVector, float shininess, float diffuseness) {
  vec3 normal = worldNormal;

  vec3 lightVector = normalize(-light);

  vec3 halfVector = normalize(EyeVector + lightVector);

  float NdotL = dot(normal, lightVector);

  float kDiffuse = max(0.0, NdotL);

  float NdotH = dot(normal, halfVector);

  float NdotH2 = NdotH * NdotH;

  float kSpecular = pow(NdotH2, shininess);

  return kSpecular + kDiffuse * diffuseness;
}

#pragma glslify:export(specular);