export const silkVertex = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const silkFragment = /* glsl */ `
varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uRes;
uniform vec3 uLight;
uniform vec3 uBase;
uniform vec3 uShadow;
uniform vec3 uGold;

float folds(vec2 p, float t) {
  // длинные косые складки драпировки + мелкая рябь
  float v = sin(p.x * 1.6 + p.y * 0.8 + t * 0.5 + sin(p.y * 1.3 + t * 0.25) * 1.8);
  v += 0.5 * sin(p.x * 0.9 - p.y * 2.1 - t * 0.35 + sin(p.x * 1.7) * 0.9);
  v += 0.2 * sin((p.x - p.y) * 3.4 + t * 0.4);
  return v;
}

void main() {
  vec2 p = vUv * vec2(uRes.x / uRes.y, 1.0) * 2.6;
  p += (uMouse - 0.5) * 0.6 * smoothstep(0.9, 0.0, distance(vUv, uMouse));
  float h = folds(p, uTime);
  float e = 0.01;
  float dx = folds(p + vec2(e, 0.0), uTime) - h;
  float dy = folds(p + vec2(0.0, e), uTime) - h;
  vec3 normal = normalize(vec3(-dx / e * 0.35, -dy / e * 0.35, 1.0));
  vec3 lightDir = normalize(vec3(-0.6, 0.5, 0.6));
  float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);
  float specular = pow(clamp(dot(reflect(-lightDir, normal), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 60.0);
  vec3 color = mix(uBase, uLight, smoothstep(0.3, 1.0, diffuse));
  color = mix(color, uShadow, smoothstep(0.5, 0.0, diffuse) * 0.6);
  color += uGold * specular * 0.25;
  gl_FragColor = vec4(color, 1.0);
}
`;
