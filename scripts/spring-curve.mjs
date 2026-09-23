// Oyna morfi uchun soʻnuvchi prujina egri chizigʻi: CSS linear() va GSAP CustomEase uchun bir xil nuqtalar.
const response = Number(process.argv[2] ?? 0.4);
const damping = Number(process.argv[3] ?? 0.86);
const points = Number(process.argv[4] ?? 32);

const omega0 = (2 * Math.PI) / response;
const omegaD = omega0 * Math.sqrt(1 - damping * damping);
const duration = response * 2.2;

function x(t) {
  const decay = Math.exp(-damping * omega0 * t);
  return 1 - decay * (Math.cos(omegaD * t) + ((damping * omega0) / omegaD) * Math.sin(omegaD * t));
}

const samples = [];
for (let i = 0; i <= points; i++) {
  const t = (i / points) * duration;
  samples.push(x(t));
}
const last = samples[samples.length - 1];
const normalized = samples.map((v) => v / last);
const css = `linear(${normalized.map((v) => v.toFixed(4)).join(", ")})`;
const gsap = normalized.map((v, i) => `${(i / points).toFixed(4)},${v.toFixed(4)}`).join(" ");

console.log(
  JSON.stringify(
    { response, damping, durationMs: Math.round(duration * 1000), css, gsap },
    null,
    2,
  ),
);
