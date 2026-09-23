export const ABR_VERTEX = /* glsl */ `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/**
 * Margʻilon xon-atlas: vertikal arqoq yoʻllari, har yoʻl alohida boʻyoq vannasi (pogʻonali chet),
 * ipak yaltirashi (anizotrop), sekin drift (12–16 s) va kursordan yumshoq toʻlqin.
 * GLSL ichida izoh yoʻq: ANGLE manbada ASCII dan tashqari belgini rad etadi.
 * Tartib: yoʻl indeksi → kursor toʻlqini → har yoʻlning boʻyoq siljishi → abr shakli (fbm, pogʻona,
 * patli chet) → boʻyoq tanlovi → arqoq tolasi → anizotrop yaltirash → yoʻl chegarasi.
 */
export const ABR_FRAGMENT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform float uTime;
uniform vec2 uRes;
uniform vec3 uPointer;uniform vec3 uBg;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uC4;
uniform float uNight;
uniform float uSeed;

float hash(float n) { return fract(sin(n * 127.1 + uSeed) * 43758.5453); }
float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash2(i);
  float b = hash2(i + vec2(1.0, 0.0));
  float c = hash2(i + vec2(0.0, 1.0));
  float d = hash2(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + 11.7;
    a *= 0.5;
  }
  return v;
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = vUv;
  float drift = uTime / 14.0;

  float bandsPerScreen = mix(22.0, 34.0, clamp(aspect - 0.5, 0.0, 1.0));
  float bx = uv.x * bandsPerScreen;
  float band = floor(bx);
  float inBand = fract(bx);

  vec2 d = (uv - uPointer.xy) * vec2(aspect, 1.0);
  float dist = length(d);
  float ripple = uPointer.z * exp(-dist * 4.0) * sin(dist * 22.0 - uTime * 3.0) * 0.06;

  float shift = (hash(band) - 0.5) * 0.18;
  float y = uv.y + shift + ripple + sin(drift * 6.2831 + band * 0.4) * 0.02;

  float n = fbm(vec2(band * 0.37 + drift * 0.6, y * 2.2));
  float m = fbm(vec2(band * 0.11 - drift * 0.4, y * 0.9 + 7.0));
  float steps = 5.0;
  float q = floor(n * steps) / steps;
  float edge = fract(n * steps);
  float feather = smoothstep(0.0, 0.18, edge) * (1.0 - smoothstep(0.82, 1.0, edge));

  vec3 col = uBg;
  vec3 dye;
  float t = q + m * 0.15;
  if (t < 0.28) dye = uC1;
  else if (t < 0.52) dye = uC2;
  else if (t < 0.74) dye = uC3;
  else dye = uC4;
  float cover = smoothstep(0.18, 0.32, n) * mix(0.7, 1.0, feather);
  col = mix(col, dye, cover * mix(0.85, 0.95, uNight));

  float thread = 0.5 + 0.5 * sin(inBand * 6.2831 * 3.0);
  col *= 1.0 - 0.04 * thread;

  float sheenPos = fract(drift * 0.5);
  float sheen = pow(1.0 - abs(uv.x * 0.7 + uv.y * 0.3 - sheenPos), 18.0);
  col += sheen * mix(0.10, 0.07, uNight) * mix(vec3(1.0), uC2, 0.5);

  float gap = smoothstep(0.0, 0.05, inBand) * smoothstep(1.0, 0.95, inBand);
  col *= mix(0.93, 1.0, gap);

  outColor = vec4(col, 1.0);
}
`;
