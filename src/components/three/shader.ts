// Общая функция рельефа ткани: длинные косые складки драпировки с острыми гребнями
// и широкими мягкими впадинами + продавливание и волна от курсора.
const drape = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uRipple;
uniform vec2 uSize;

float crest(float x, float sharpness) {
  return pow(0.5 + 0.5 * sin(x), sharpness);
}

float drape(vec2 p, vec2 uv) {
  float t = uTime;
  vec2 q = p;
  q.x += 0.35 * sin(p.y * 1.3 + t * 0.4);
  q.y += 0.25 * sin(p.x * 1.1 - t * 0.3);
  float along = dot(q, vec2(0.8, 0.6));
  float across = dot(q, vec2(-0.6, 0.8));
  float h = crest(along * 4.6 + sin(across * 1.4 + t * 0.5) * 1.4 + t * 0.35, 6.0) * 0.55;
  h += crest(along * 8.3 - across * 0.9 + t * 0.55, 8.0) * 0.2;
  h += crest(across * 2.3 + along * 0.6 - t * 0.25, 2.0) * 0.12;
  // крупные медленные волны полотна, чтобы складки не шли ровными полосами
  h += 0.28 * sin(across * 0.9 + t * 0.2) * sin(along * 0.7 - t * 0.15);
  // справа складки крупнее, слева — под текстом — спокойнее
  h *= mix(0.35, 1.0, smoothstep(0.1, 0.8, uv.x));
  vec2 aspect = vec2(uSize.x / uSize.y, 1.0);
  float d = distance(uv * aspect, uMouse * aspect);
  h -= 0.1 * exp(-d * d * 30.0);
  h += uRipple * 0.05 * sin(d * 28.0 - t * 6.0) * exp(-d * 5.0);
  return h;
}
`;

export const silkVertex = /* glsl */ `
${drape}
uniform float uAmplitude;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vTangent;
varying float vHeight;
varying vec2 vUv;

void main() {
  vec2 p = position.xy;
  float e = 0.01;
  vec2 duv = vec2(e) / uSize;
  float h = drape(p, uv);
  float hx = drape(p + vec2(e, 0.0), uv + vec2(duv.x, 0.0));
  float hy = drape(p + vec2(0.0, e), uv + vec2(0.0, duv.y));
  vec3 normal = normalize(vec3(-(hx - h) / e * uAmplitude, -(hy - h) / e * uAmplitude, 1.0));
  vec3 crestDir = normalize(vec3(-0.6, 0.8, 0.0));
  vec3 tangent = normalize(crestDir - normal * dot(normal, crestDir));

  vec4 world = modelMatrix * vec4(p, h * uAmplitude, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vTangent = normalize(mat3(modelMatrix) * tangent);
  vHeight = h;
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const silkFragment = /* glsl */ `
uniform vec3 uLight;
uniform vec3 uShadow;
uniform vec3 uDeep;
uniform vec3 uGold;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vTangent;
varying float vHeight;
varying vec2 vUv;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 L = normalize(vec3(-0.8, 0.55, 0.35));
  vec3 H = normalize(L + V);
  float ndl = dot(N, L);

  // теневая сторона складки → песочный тон → светлые гребни
  float diffuse = clamp(ndl * 0.85 + 0.15, 0.0, 1.0);
  vec3 color = mix(uDeep, uShadow, smoothstep(0.0, 0.55, diffuse));
  color = mix(color, uLight, smoothstep(0.55, 1.0, diffuse));
  // тени во впадинах складок
  float cavity = smoothstep(0.0, 0.35, vHeight);
  color *= mix(0.82, 1.0, cavity);

  // анизотропный блик вдоль гребней (Kajiya–Kay) — шелковистый золотой отлив
  vec3 T = normalize(vTangent);
  float th = dot(T, H);
  float sheen = pow(sqrt(max(0.0, 1.0 - th * th)), 90.0) * smoothstep(-0.1, 0.4, ndl);
  color += uGold * sheen * 0.6;
  // широкий мягкий блик и золотистая кромка на склонах складок
  color += vec3(1.0, 0.97, 0.9) * pow(max(dot(N, H), 0.0), 28.0) * 0.16;
  color += uGold * pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.12;
  // едва заметное плетение
  color += sin(vUv.x * 1400.0) * sin(vUv.y * 1400.0) * 0.008;

  gl_FragColor = vec4(color, 1.0);
}
`;
