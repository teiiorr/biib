/*
 * Fon naqşi — faqat Samarqand ufqi. Registon uslubidagi peştoq,
 * qovurgʻali gumbaz va minoralar bir uzluksiz ufq bölib turadi:
 * tinç, statik, premium. Boşqa naqş yöq.
 *
 * Öqigiçdan yaşiringan; oltin çiziq, xiralik past, markazda söniladi —
 * matn kontrasti saqlanadi.
 */
export function OrnamentField() {
  return (
    <div aria-hidden="true" className="skyline-field">
      <svg width="100%" height="100%" role="presentation">
        <defs>
          <pattern id="skyline" width="300" height="212" patternUnits="userSpaceOnUse">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M0 190H300" />
              {/* Gumbazli masjid */}
              <path d="M38 190V150H72V190" />
              <path d="M50 190V166C50 160 54 157 60 157C66 157 70 160 70 166V190" />
              <path d="M44 150V142H66V150" />
              <path d="M44 142C44 122 50 110 55 108C60 110 66 122 66 142" />
              <path d="M55 108V100M55 142V110" />
              {/* Peştoq */}
              <path d="M96 190V96H144V190" />
              <path d="M106 190V140C106 120 112 110 120 106C128 110 134 120 134 140V190" />
              <path d="M108 96V88H132V96" />
              <path d="M108 88C108 66 114 52 120 48C126 52 132 66 132 88" />
              <path d="M120 48V40M120 88V50" />
              {/* Minora */}
              <path d="M171 190 173 84M179 190 177 84" />
              <path d="M169 118H181M169 96H181" />
              <path d="M171 84C171 74 175 68 175 66C175 68 179 74 179 84" />
              {/* Kiçik gumbazli ayvon */}
              <path d="M218 190V156H252V190" />
              <path d="M228 190V172C228 166 232 163 235 163C238 163 242 166 242 172V190" />
              <path d="M224 156V148H246V156" />
              <path d="M224 148C224 130 230 120 235 118C240 120 246 130 246 148" />
              <path d="M235 118V110" />
            </g>
            <g fill="currentColor" stroke="none">
              <circle cx="120" cy="38" r="1.9" />
              <circle cx="175" cy="63" r="1.6" />
              <circle cx="55" cy="98" r="1.5" />
              <circle cx="235" cy="108" r="1.5" />
              <circle cx="285" cy="46" r="1.3" />
              <circle cx="18" cy="70" r="1.3" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#skyline)" />
      </svg>
    </div>
  );
}
