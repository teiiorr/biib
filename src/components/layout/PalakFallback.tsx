/** Palak medalyonining oddiy koʻrinishi: naqsh moduli kelguncha zanjir chok halqasi, bitta boʻshliq bilan. */
export function PalakFallback() {
  const dots: string[] = [];
  const n = 72;
  for (let i = 0; i < n; i++) {
    if (i === 17) continue;
    const a = (Math.PI * 2 * i) / n;
    dots.push(`${(100 + 84 * Math.cos(a)).toFixed(1)},${(100 + 84 * Math.sin(a)).toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 200 200" className="error-art" aria-hidden="true">
      {dots.map((d) => {
        const [x, y] = d.split(",");
        return <circle key={d} cx={x} cy={y} r="2.2" fill="currentColor" />;
      })}
      <circle
        cx="100"
        cy="100"
        r="56"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 5"
      />
      <circle
        cx="100"
        cy="100"
        r="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
    </svg>
  );
}
