import { cn } from "@/lib/cn";

/**
 * Sahifa ortidagi rangli muhit. Bitta qatlam, butun sayt uçun:
 * fon qora bölmasin va şişaning ostida xiralaştiradigan narsa bölsin.
 */
export function Ambient() {
  return <div aria-hidden="true" className="ambient" />;
}

/** Plyonka zarrasi — butun sahifa ustida bitta statik qatlam. */
export function Grain() {
  return <div aria-hidden="true" className="grain" />;
}

/**
 * Samarqand ufqi — sahifa foni uçun çeksiz naqş. Registon uslubidagi
 * peştoq, qovurgʻali gumbaz va ikki minora bir katakda; katak çetlari
 * boş, şuning uçun tekis tökiladi. Original çizgi — Shutterstock dagi
 * litsenziyali vektor emas, faqat şu ruh.
 *
 * Öqigiçdan yaşiringan bezak; rang oltin, xiralik past — matn kontrasti
 * saqlanadi.
 */
export function SamarkandField({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("samarkand", className)}>
      <svg width="100%" height="100%" role="presentation">
        <defs>
          <pattern
            id="samarkand-skyline"
            width="300"
            height="212"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1)"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Uzluksiz zamin çizigʻi — seam da tutaşadi. */}
              <path d="M0 190H300" />

              {/* 1. Gumbazli masjid. */}
              <path d="M38 190V150H72V190" />
              <path d="M50 190V166C50 160 54 157 60 157C66 157 70 160 70 166V190" />
              <path d="M44 150V142H66V150" />
              <path d="M44 142C44 122 50 110 55 108C60 110 66 122 66 142" />
              <path d="M55 108V100M55 142V110" />

              {/* 2. Peştoq — uçli ayvon, ortida gumbaz. */}
              <path d="M96 190V96H144V190" />
              <path d="M106 190V140C106 120 112 110 120 106C128 110 134 120 134 140V190" />
              <path d="M108 96V88H132V96" />
              <path d="M108 88C108 66 114 52 120 48C126 52 132 66 132 88" />
              <path d="M120 48V40M120 88V50" />

              {/* 3. Minora. */}
              <path d="M171 190 173 84M179 190 177 84" />
              <path d="M169 118H181M169 96H181" />
              <path d="M171 84C171 74 175 68 175 66C175 68 179 74 179 84" />

              {/* 4. Kiçik gumbazli ayvon. */}
              <path d="M218 190V156H252V190" />
              <path d="M228 190V172C228 166 232 163 235 163C238 163 242 166 242 172V190" />
              <path d="M224 156V148H246V156" />
              <path d="M224 148C224 130 230 120 235 118C240 120 246 130 246 148" />
              <path d="M235 118V110" />
            </g>

            {/* Tungi osmon yulduzlari + gumbaz cho'qqilari. */}
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
        <rect width="100%" height="100%" fill="url(#samarkand-skyline)" />
      </svg>
    </div>
  );
}

/** Girih suv belgisi. Bezak, şuning uçun öqigiçdan yaşirilgan. */
export function Girih({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("girih", className)} />;
}

/**
 * Qahramon ortidagi aura. Ekranda bittasi: §16.5 böyiça bir bölimga
 * bitta muallif jesti.
 */
export function Aura({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("aura", className)} />;
}
