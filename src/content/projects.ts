import type { ProjectItem } from "./types";

/**
 * LOYIHALAR. Matnlar beş tilda; id, rang va rasm kodda turadi.
 * Yangi loyiha qöşilsa — illustration nomi ProjectIllustration ga ham qöşiladi.
 */
export const PROJECTS: readonly ProjectItem[] = [
  {
    id: "upop-trend",
    name: {
      "uz-Latn": "UPOP TREND",
      "uz-Cyrl": "UPOP TREND",
      "uz-Latn-x-reform": "UPOP TREND",
      ru: "UPOP TREND",
      en: "UPOP TREND",
    },
    tagline: {
      "uz-Latn": "Milliy qoʻshiqchilik kastingi",
      "uz-Cyrl": "Миллий қўшиқчилик кастинги",
      "uz-Latn-x-reform": "Milliy qöşiqçilik kastingi",
      ru: "Национальный вокальный кастинг",
      en: "National singing auditions",
    },
    body: {
      "uz-Latn": [
        "Birlashmaning bosh loyihasi. Tanlov viloyat bosqichlaridan boshlanadi: ariza topshirgan har bir bola jonli chiqish qiladi va ustozlardan izoh oladi.",
        "Keyingi bosqichga oʻtganlar bilan bir necha hafta ishlanadi: ovoz, nafas, sahnada turish. Yakunda poytaxtdagi katta konsert.",
        "Kastingning oʻz sayti bor: muddatlar, shartlar va ariza shakli oʻsha yerda.",
      ],
      "uz-Cyrl": [
        "Бирлашманинг бош лойиҳаси. Танлов вилоят босқичларидан бошланади: ариза топширган ҳар бир бола жонли чиқиш қилади ва устозлардан изоҳ олади.",
        "Кейинги босқичга ўтганлар билан бир неча ҳафта ишланади: овоз, нафас, саҳнада туриш. Якунда пойтахтдаги катта концерт.",
        "Кастингнинг ўз сайти бор: муддатлар, шартлар ва ариза шакли ўша ерда.",
      ],
      "uz-Latn-x-reform": [
        "Birlaşmaning boş loyihasi. Tanlov viloyat bosqiçlaridan boşlanadi: ariza topşirgan har bir bola jonli çiqiş qiladi va ustozlardan izoh oladi.",
        "Keyingi bosqiçga ötganlar bilan bir neça hafta işlanadi: ovoz, nafas, sahnada turiş. Yakunda poytaxtdagi katta konsert.",
        "Kastingning öz sayti bor: muddatlar, şartlar va ariza şakli öşa yerda.",
      ],
      ru: [
        "Главный проект объединения. Конкурс начинается с областных этапов: каждый ребёнок, подавший заявку, выступает вживую и получает разбор от наставников.",
        "С теми, кто проходит дальше, работают несколько недель — голос, дыхание, поведение на сцене. В финале большой концерт в столице.",
        "У кастинга есть свой сайт: сроки, условия и форма заявки собраны там.",
      ],
      en: [
        "The flagship project of the association. The competition starts with the regional rounds: every child who applies performs live and gets comments from the mentors.",
        "Those who go through spend several weeks working on voice, breathing and holding the stage. It ends with a big concert in the capital.",
        "The auditions have a site of their own, with the dates, the terms and the application form.",
      ],
    },
    facts: {
      "uz-Latn": [
        "Ariza bepul, tavsiya kerak emas",
        "12 yoshdan 18 yoshgacha",
        "Yakuniy konsert poytaxt sahnasida",
      ],
      "uz-Cyrl": [
        "Ариза бепул, тавсия керак эмас",
        "12 ёшдан 18 ёшгача",
        "Якуний концерт пойтахт саҳнасида",
      ],
      "uz-Latn-x-reform": [
        "Ariza bepul, tavsiya kerak emas",
        "12 yoşdan 18 yoşgaça",
        "Yakuniy konsert poytaxt sahnasida",
      ],
      ru: [
        "Заявка бесплатная, рекомендации не нужны",
        "От 12 до 18 лет",
        "Финальный концерт на столичной сцене",
      ],
      en: [
        "Applying is free, no reference needed",
        "From 12 to 18 years old",
        "Final concert on a stage in the capital",
      ],
    },
    accent: "coral",
    illustration: "stage",
    flagship: true,
    external: { href: "https://upop.uz", label: "upop.uz" },
  },
  {
    id: "rangli-olam",
    name: {
      "uz-Latn": "Rangli olam",
      "uz-Cyrl": "Рангли олам",
      "uz-Latn-x-reform": "Rangli olam",
      ru: "Рангли олам",
      en: "Rangli olam",
    },
    tagline: {
      "uz-Latn": "Tasviriy sanʼat studiyalari va koʻrgazmalar",
      "uz-Cyrl": "Тасвирий санъат студиялари ва кўргазмалар",
      "uz-Latn-x-reform": "Tasviriy sanʼat studiyalari va körgazmalar",
      ru: "Студии изобразительного искусства и выставки",
      en: "Fine art studios and exhibitions",
    },
    body: {
      "uz-Latn": [
        "Rasm, grafika va amaliy sanʼat studiyalari. Mashgʻulotlar hafta oxirida oʻtadi, materiallar studiya hisobidan.",
        "Yil davomida yigʻilgan ishlardan viloyat koʻrgazmalari tuziladi, eng yaxshilari umumiy katalogga kiradi.",
        "Studiyaga yozilish uchun rasm chizishni bilish shart emas — boshlovchi guruhlar alohida.",
      ],
      "uz-Cyrl": [
        "Расм, графика ва амалий санъат студиялари. Машғулотлар ҳафта охирида ўтади, материаллар студия ҳисобидан.",
        "Йил давомида йиғилган ишлардан вилоят кўргазмалари тузилади, энг яхшилари умумий каталогга киради.",
        "Студияга ёзилиш учун расм чизишни билиш шарт эмас — бошловчи гуруҳлар алоҳида.",
      ],
      "uz-Latn-x-reform": [
        "Rasm, grafika va amaliy sanʼat studiyalari. Maşğulotlar hafta oxirida ötadi, materiallar studiya hisobidan.",
        "Yil davomida yiğilgan işlardan viloyat körgazmalari tuziladi, eng yaxşilari umumiy katalogga kiradi.",
        "Studiyaga yoziliş uçun rasm çizişni biliş şart emas — boşlovçi guruhlar alohida.",
      ],
      ru: [
        "Студии рисунка, графики и прикладного искусства. Занятия проходят по выходным, материалы за счёт студии.",
        "Из работ, собранных за год, составляют областные выставки, а лучшие попадают в общий каталог.",
        "Чтобы записаться в студию, уметь рисовать не обязательно: для начинающих есть отдельные группы.",
      ],
      en: [
        "Studios for drawing, graphic art and applied art. Classes run at the weekend and the materials are paid for by the studio.",
        "The work collected over the year becomes the regional exhibitions, and the best of it goes into a shared catalogue.",
        "You do not need to know how to draw to sign up: beginners have their own groups.",
      ],
    },
    facts: {
      "uz-Latn": [
        "Materiallar studiya hisobidan",
        "7 yoshdan 16 yoshgacha",
        "Yil yakunida umumiy koʻrgazma",
      ],
      "uz-Cyrl": [
        "Материаллар студия ҳисобидан",
        "7 ёшдан 16 ёшгача",
        "Йил якунида умумий кўргазма",
      ],
      "uz-Latn-x-reform": [
        "Materiallar studiya hisobidan",
        "7 yoşdan 16 yoşgaça",
        "Yil yakunida umumiy körgazma",
      ],
      ru: [
        "Материалы за счёт студии",
        "От 7 до 16 лет",
        "В конце года общая выставка",
      ],
      en: [
        "Materials paid for by the studio",
        "From 7 to 16 years old",
        "A shared exhibition at the end of the year",
      ],
    },
    accent: "sun",
    illustration: "palette",
  },
  {
    id: "sahna-bolalari",
    name: {
      "uz-Latn": "Sahna bolalari",
      "uz-Cyrl": "Саҳна болалари",
      "uz-Latn-x-reform": "Sahna bolalari",
      ru: "Сахна болалари",
      en: "Sahna bolalari",
    },
    tagline: {
      "uz-Latn": "Bolalar teatri va sahna nutqi",
      "uz-Cyrl": "Болалар театри ва саҳна нутқи",
      "uz-Latn-x-reform": "Bolalar teatri va sahna nutqi",
      ru: "Детский театр и сценическая речь",
      en: "Children’s theatre and stage speech",
    },
    body: {
      "uz-Latn": [
        "Teatr mashgʻulotlari nutqdan boshlanadi: nafas, talaffuz, matn bilan ishlash. Keyin sahna harakati va kichik sahnachalar.",
        "Har mavsum oxirida guruhlar oʻz spektaklini koʻrsatadi. Tomoshabin — ota-onalar, maktab va shahar.",
        "Loyiha ayniqsa uyalchan bolalar uchun foydali: matn ortida turish oson, sahnaga chiqish esa oʻrganiladi.",
      ],
      "uz-Cyrl": [
        "Театр машғулотлари нутқдан бошланади: нафас, талаффуз, матн билан ишлаш. Кейин саҳна ҳаракати ва кичик саҳначалар.",
        "Ҳар мавсум охирида гуруҳлар ўз спектаклини кўрсатади. Томошабин — ота-оналар, мактаб ва шаҳар.",
        "Лойиҳа айниқса уялчан болалар учун фойдали: матн ортида туриш осон, саҳнага чиқиш эса ўрганилади.",
      ],
      "uz-Latn-x-reform": [
        "Teatr maşğulotlari nutqdan boşlanadi: nafas, talaffuz, matn bilan işlaş. Keyin sahna harakati va kiçik sahnaçalar.",
        "Har mavsum oxirida guruhlar öz spektaklini körsatadi. Tomoşabin — ota-onalar, maktab va şahar.",
        "Loyiha ayniqsa uyalçan bolalar uçun foydali: matn ortida turiş oson, sahnaga çiqiş esa örganiladi.",
      ],
      ru: [
        "Театральные занятия начинаются с речи: дыхание, произношение, работа с текстом. Дальше сценическое движение и небольшие этюды.",
        "В конце каждого сезона группы показывают свой спектакль. Зрители — родители, школа и город.",
        "Проект особенно полезен застенчивым детям: за текстом стоять легко, а выходить на сцену учатся.",
      ],
      en: [
        "Theatre classes begin with speech: breathing, pronunciation, working with a text. Then come stage movement and short scenes.",
        "At the end of each season the groups show a play of their own. The audience is parents, the school and the town.",
        "The project is especially good for shy children: standing behind a text is easy, and stepping onto the stage is something you learn.",
      ],
    },
    facts: {
      "uz-Latn": [
        "Nutq va sahna harakati birga",
        "9 yoshdan 17 yoshgacha",
        "Mavsum yakunida spektakl",
      ],
      "uz-Cyrl": [
        "Нутқ ва саҳна ҳаракати бирга",
        "9 ёшдан 17 ёшгача",
        "Мавсум якунида спектакль",
      ],
      "uz-Latn-x-reform": [
        "Nutq va sahna harakati birga",
        "9 yoşdan 17 yoşgaça",
        "Mavsum yakunida spektakl",
      ],
      ru: [
        "Речь и сценическое движение вместе",
        "От 9 до 17 лет",
        "В конце сезона спектакль",
      ],
      en: [
        "Speech and stage movement together",
        "From 9 to 17 years old",
        "A play at the end of the season",
      ],
    },
    accent: "grape",
    illustration: "curtain",
  },
  {
    id: "ertak-ustaxonasi",
    name: {
      "uz-Latn": "Ertak ustaxonasi",
      "uz-Cyrl": "Эртак устахонаси",
      "uz-Latn-x-reform": "Ertak ustaxonasi",
      ru: "Эртак устахонаси",
      en: "Ertak ustaxonasi",
    },
    tagline: {
      "uz-Latn": "Yosh yozuvchilar va animatsiya",
      "uz-Cyrl": "Ёш ёзувчилар ва анимация",
      "uz-Latn-x-reform": "Yoş yozuvçilar va animatsiya",
      ru: "Юные писатели и анимация",
      en: "Young writers and animation",
    },
    body: {
      "uz-Latn": [
        "Bolalar oʻz hikoyasini yozadi, keyin uni rasm va ovoz bilan qisqa multfilmga aylantiradi.",
        "Ustaxonada yozuvchi, rassom va montajchi birga ishlaydi: bir hikoya bir necha qoʻldan oʻtadi.",
        "Tayyor ishlar birlashmaning kanalida chiqadi, mualliflar ismi bilan.",
      ],
      "uz-Cyrl": [
        "Болалар ўз ҳикоясини ёзади, кейин уни расм ва овоз билан қисқа мультфильмга айлантиради.",
        "Устахонада ёзувчи, рассом ва монтажчи бирга ишлайди: бир ҳикоя бир неча қўлдан ўтади.",
        "Тайёр ишлар бирлашманинг каналида чиқади, муаллифлар исми билан.",
      ],
      "uz-Latn-x-reform": [
        "Bolalar öz hikoyasini yozadi, keyin uni rasm va ovoz bilan qisqa multfilmga aylantiradi.",
        "Ustaxonada yozuvçi, rassom va montajçi birga işlaydi: bir hikoya bir neça qöldan ötadi.",
        "Tayyor işlar birlaşmaning kanalida çiqadi, mualliflar ismi bilan.",
      ],
      ru: [
        "Дети пишут свою историю, а потом превращают её в короткий мультфильм с рисунками и голосом.",
        "В мастерской вместе работают автор, художник и монтажёр: одна история проходит через несколько рук.",
        "Готовые работы выходят на канале объединения, с именами авторов.",
      ],
      en: [
        "Children write a story of their own, then turn it into a short animated film with drawings and sound.",
        "In the workshop a writer, an artist and an editor work side by side: one story passes through several pairs of hands.",
        "Finished work goes out on the channel of the association, under the names of the authors.",
      ],
    },
    facts: {
      "uz-Latn": [
        "Hikoyadan multfilmgacha bir mavsum",
        "10 yoshdan 16 yoshgacha",
        "Ishlar mualliflar ismi bilan chiqadi",
      ],
      "uz-Cyrl": [
        "Ҳикоядан мультфильмгача бир мавсум",
        "10 ёшдан 16 ёшгача",
        "Ишлар муаллифлар исми билан чиқади",
      ],
      "uz-Latn-x-reform": [
        "Hikoyadan multfilmgaça bir mavsum",
        "10 yoşdan 16 yoşgaça",
        "Işlar mualliflar ismi bilan çiqadi",
      ],
      ru: [
        "От истории до мультфильма один сезон",
        "От 10 до 16 лет",
        "Работы выходят с именами авторов",
      ],
      en: [
        "From story to film in one season",
        "From 10 to 16 years old",
        "Work goes out under the names of the authors",
      ],
    },
    accent: "grass",
    illustration: "storybook",
  },
];
