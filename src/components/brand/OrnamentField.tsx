/*
 * Fon naqşi — skroll böyiça almaşadi. Üç original naqş bir-birining
 * ustida turadi va scroll() çizigʻi böyiça navbatma-navbat körinadi:
 * ikat (adras) → Rişton koşinlari → Samarqand ufqi, bir neça marta
 * aylanadi. Faqat opacity animatsiya qilinadi (kompozitor oqimida),
 * JS yöq. Naqşlar original çizgi — Shutterstock vektorlari emas.
 *
 * Öqigiçdan yaşiringan; xiralik past va markazda söniladi — matn
 * kontrasti saqlanadi.
 */
export function OrnamentField() {
  return (
    <div aria-hidden="true" className="orn-field">
      {/* 1 — Ikat / adras: tik feðerli romblar. */}
      <div className="orn-layer orn-layer--ikat">
        <svg width="100%" height="100%" role="presentation">
          <defs>
            <pattern id="orn-ikat" width="120" height="160" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
                <path d="M60 4 96 40 60 76 24 40Z" />
                <path d="M60 84 96 120 60 156 24 120Z" />
                <path d="M60 22 80 40 60 58 40 40Z" opacity="0.6" />
                <path d="M60 102 80 120 60 138 40 120Z" opacity="0.6" />
                <path d="M0 4 24 40 0 76" />
                <path d="M0 84 24 120 0 156" />
                <path d="M120 4 96 40 120 76" />
                <path d="M120 84 96 120 120 156" />
                <g strokeWidth="1" opacity="0.75">
                  <path d="M24 40 16 36M24 40 16 44M96 40 104 36M96 40 104 44" />
                  <path d="M24 120 16 116M24 120 16 124M96 120 104 116M96 120 104 124" />
                </g>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#orn-ikat)" />
        </svg>
      </div>

      {/* 2 — Rişton koşini: sakkiz burçakli yulduz va gul markaz. */}
      <div className="orn-layer orn-layer--rishton">
        <svg width="100%" height="100%" role="presentation">
          <defs>
            <pattern id="orn-rishton" width="120" height="120" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
                <path d="M60 8 112 60 60 112 8 60Z" />
                <path d="M30 30 90 30 90 90 30 90Z" />
                <g strokeWidth="1">
                  <circle cx="60" cy="60" r="6" />
                  <path d="M60 46 64 56 60 60 56 56Z" />
                  <path d="M60 74 64 64 60 60 56 64Z" />
                  <path d="M46 60 56 64 60 60 56 56Z" />
                  <path d="M74 60 64 64 60 60 64 56Z" />
                </g>
                <circle cx="0" cy="0" r="5" />
                <circle cx="120" cy="0" r="5" />
                <circle cx="0" cy="120" r="5" />
                <circle cx="120" cy="120" r="5" />
                <path
                  d="M0 13 7 7 13 0M120 13 113 7 107 0M0 107 7 113 13 120M120 107 113 113 107 120"
                  opacity="0.7"
                />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#orn-rishton)" />
        </svg>
      </div>

      {/* 3 — Samarqand ufqi: peştoq, gumbaz, minora. */}
      <div className="orn-layer orn-layer--skyline">
        <svg width="100%" height="100%" role="presentation">
          <defs>
            <pattern id="orn-skyline" width="300" height="212" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 190H300" />
                <path d="M38 190V150H72V190" />
                <path d="M50 190V166C50 160 54 157 60 157C66 157 70 160 70 166V190" />
                <path d="M44 150V142H66V150" />
                <path d="M44 142C44 122 50 110 55 108C60 110 66 122 66 142" />
                <path d="M55 108V100M55 142V110" />
                <path d="M96 190V96H144V190" />
                <path d="M106 190V140C106 120 112 110 120 106C128 110 134 120 134 140V190" />
                <path d="M108 96V88H132V96" />
                <path d="M108 88C108 66 114 52 120 48C126 52 132 66 132 88" />
                <path d="M120 48V40M120 88V50" />
                <path d="M171 190 173 84M179 190 177 84" />
                <path d="M169 118H181M169 96H181" />
                <path d="M171 84C171 74 175 68 175 66C175 68 179 74 179 84" />
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
          <rect width="100%" height="100%" fill="url(#orn-skyline)" />
        </svg>
      </div>
    </div>
  );
}
