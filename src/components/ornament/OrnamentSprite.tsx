import { girihStar } from "@/lib/girih";

export const STAR_SYMBOL_ID = "orn-star-10";
const STAR_UNIT = 100;

/**
 * Bir marta chiziladigan belgilar: muqovalardagi girih yulduzi <use> orqali qayta ishlatiladi,
 * shunda har muqova 45 yoʻl oʻrniga bitta havola tashiydi.
 */
export function OrnamentSprite() {
  const star = girihStar(10, STAR_UNIT);
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <symbol id={STAR_SYMBOL_ID} viewBox={`0 0 ${STAR_UNIT} ${STAR_UNIT}`}>
        {star.strands.map((d, i) => (
          <path key={i} className="orn-strand" d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </symbol>
    </svg>
  );
}
