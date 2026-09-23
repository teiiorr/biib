import type { Project } from "./types";

/**
 * Loyihalar. Matnlar qoralama (draft): tashkilot tasdiqlaguncha sahifa noindex.
 * Joy, vaqt va ustoz tashkilotdan kelishi kerak (pending).
 */
export const PROJECTS: readonly Project[] = [
  {
    key: "upop-trend",
    status: "draft",
    flagship: true,
    name: {
      uz: "UPOP TREND",
      oz: "UPOP TREND",
      ozbekca: "UPOP TREND",
      ru: "UPOP TREND",
      en: "UPOP TREND",
    },
    tagline: {
      uz: "Milliy qoʻshiqchilik kastingi",
      oz: "Миллий қўшиқчилик кастинги",
      ozbekca: "Milliy qöşiqçilik kastingi",
      ru: "Национальный вокальный кастинг",
      en: "National singing auditions",
    },
    body: {
      uz: [
        "Birlashmaning bosh loyihasi. Tanlov viloyat bosqichlaridan boshlanadi: ariza topshirgan har bir bola jonli chiqish qiladi va ustozlardan izoh oladi.",
        "Keyingi bosqichga oʻtganlar bilan bir necha hafta ishlanadi: ovoz, nafas, sahnada turish. Yakunda poytaxtdagi katta konsert.",
        "Kastingning oʻz sayti bor: muddatlar, shartlar va ariza shakli oʻsha yerda.",
      ],
      oz: [
        "Бирлашманинг бош лойиҳаси. Танлов вилоят босқичларидан бошланади: ариза топширган ҳар бир бола жонли чиқиш қилади ва устозлардан изоҳ олади.",
        "Кейинги босқичга ўтганлар билан бир неча ҳафта ишланади: овоз, нафас, саҳнада туриш. Якунда пойтахтдаги катта концерт.",
        "Кастингнинг ўз сайти бор: муддатлар, шартлар ва ариза шакли ўша ерда.",
      ],
      ozbekca: [
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
    age: {
      from: 14,
      to: 19,
      status: "draft",
    },
    format: {
      value: {
        uz: "Yakuniy konsert poytaxt sahnasida",
        oz: "Якуний концерт пойтахт саҳнасида",
        ozbekca: "Yakuniy konsert poytaxt sahnasida",
        ru: "Финальный концерт на столичной сцене",
        en: "Final concert on a stage in the capital",
      },
      status: "draft",
    },
    place: {
      value: null,
      status: "pending",
    },
    schedule: {
      value: null,
      status: "pending",
    },
    cost: {
      free: true,
      status: "draft",
    },
    teacher: {
      value: null,
      status: "pending",
    },
    highlights: {
      uz: [
        "Ariza bepul, tavsiya kerak emas",
        "14 yoshdan 19 yoshgacha",
        "Yakuniy konsert poytaxt sahnasida",
      ],
      oz: [
        "Ариза бепул, тавсия керак эмас",
        "14 ёшдан 19 ёшгача",
        "Якуний концерт пойтахт саҳнасида",
      ],
      ozbekca: [
        "Ariza bepul, tavsiya kerak emas",
        "14 yoşdan 19 yoşgaça",
        "Yakuniy konsert poytaxt sahnasida",
      ],
      ru: [
        "Заявка бесплатная, рекомендации не нужны",
        "От 14 до 19 лет",
        "Финальный концерт на столичной сцене",
      ],
      en: [
        "Applying is free, no reference needed",
        "From 14 to 19 years old",
        "Final concert on a stage in the capital",
      ],
    },
    external: {
      href: "https://upop.uz",
      label: "upop.uz",
    },
    media: {
      kind: "video",
      src: "/brand/upop-video.mp4",
      poster: "/brand/upop-video-poster.jpg",
      alt: {
        uz: "Loyiha muhokamasi: yigʻilish stolida chiqish qilayotgan rahbar",
        oz: "Лойиҳа муҳокамаси: йиғилиш столида чиқиш қилаётган раҳбар",
        ozbekca: "Loyiha muhokamasi: yiğiliş stolida çiqiş qilayotgan rahbar",
        ru: "Обсуждение проекта: выступление руководителя за столом совещания",
        en: "A discussion of the project: a speaker at the meeting table",
      },
      status: "draft",
    },
    story: {
      primary: "art-1",
      secondary: "art-2",
    },
    paper: "poster",
    videoBrief: "V4",
  },
  {
    key: "sahna-bolalari",
    status: "draft",
    flagship: false,
    name: {
      uz: "Sahna bolalari",
      oz: "Саҳна болалари",
      ozbekca: "Sahna bolalari",
      ru: "Сахна болалари",
      en: "Sahna bolalari",
    },
    tagline: {
      uz: "Bolalar teatri va sahna nutqi",
      oz: "Болалар театри ва саҳна нутқи",
      ozbekca: "Bolalar teatri va sahna nutqi",
      ru: "Детский театр и сценическая речь",
      en: "Children’s theatre and stage speech",
    },
    body: {
      uz: [
        "Teatr mashgʻulotlari nutqdan boshlanadi: nafas, talaffuz, matn bilan ishlash. Keyin sahna harakati va kichik sahnachalar.",
        "Har mavsum oxirida guruhlar oʻz spektaklini koʻrsatadi. Tomoshabin — ota-onalar, maktab va shahar.",
        "Loyiha ayniqsa uyalchan bolalar uchun foydali: matn ortida turish oson, sahnaga chiqish esa oʻrganiladi.",
      ],
      oz: [
        "Театр машғулотлари нутқдан бошланади: нафас, талаффуз, матн билан ишлаш. Кейин саҳна ҳаракати ва кичик саҳначалар.",
        "Ҳар мавсум охирида гуруҳлар ўз спектаклини кўрсатади. Томошабин — ота-оналар, мактаб ва шаҳар.",
        "Лойиҳа айниқса уялчан болалар учун фойдали: матн ортида туриш осон, саҳнага чиқиш эса ўрганилади.",
      ],
      ozbekca: [
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
    age: {
      from: 9,
      to: 17,
      status: "draft",
    },
    format: {
      value: {
        uz: "Mavsum yakunida spektakl",
        oz: "Мавсум якунида спектакль",
        ozbekca: "Mavsum yakunida spektakl",
        ru: "В конце сезона спектакль",
        en: "A play at the end of the season",
      },
      status: "draft",
    },
    place: {
      value: null,
      status: "pending",
    },
    schedule: {
      value: null,
      status: "pending",
    },
    cost: {
      free: null,
      status: "pending",
    },
    teacher: {
      value: null,
      status: "pending",
    },
    highlights: {
      uz: ["Nutq va sahna harakati birga", "9 yoshdan 17 yoshgacha", "Mavsum yakunida spektakl"],
      oz: ["Нутқ ва саҳна ҳаракати бирга", "9 ёшдан 17 ёшгача", "Мавсум якунида спектакль"],
      ozbekca: ["Nutq va sahna harakati birga", "9 yoşdan 17 yoşgaça", "Mavsum yakunida spektakl"],
      ru: ["Речь и сценическое движение вместе", "От 9 до 17 лет", "В конце сезона спектакль"],
      en: [
        "Speech and stage movement together",
        "From 9 to 17 years old",
        "A play at the end of the season",
      ],
    },
    story: {
      primary: "art-5",
      secondary: "art-2",
    },
    paper: "curtain",
    videoBrief: "V4",
  },
  {
    key: "ertak-ustaxonasi",
    status: "draft",
    flagship: false,
    name: {
      uz: "Ertak ustaxonasi",
      oz: "Эртак устахонаси",
      ozbekca: "Ertak ustaxonasi",
      ru: "Эртак устахонаси",
      en: "Ertak ustaxonasi",
    },
    tagline: {
      uz: "Yosh yozuvchilar va animatsiya",
      oz: "Ёш ёзувчилар ва анимация",
      ozbekca: "Yoş yozuvçilar va animatsiya",
      ru: "Юные писатели и анимация",
      en: "Young writers and animation",
    },
    body: {
      uz: [
        "Bolalar oʻz hikoyasini yozadi, keyin uni rasm va ovoz bilan qisqa multfilmga aylantiradi.",
        "Ustaxonada yozuvchi, rassom va montajchi birga ishlaydi: bir hikoya bir necha qoʻldan oʻtadi.",
        "Tayyor ishlar birlashmaning kanalida chiqadi, mualliflar ismi bilan.",
      ],
      oz: [
        "Болалар ўз ҳикоясини ёзади, кейин уни расм ва овоз билан қисқа мультфильмга айлантиради.",
        "Устахонада ёзувчи, рассом ва монтажчи бирга ишлайди: бир ҳикоя бир неча қўлдан ўтади.",
        "Тайёр ишлар бирлашманинг каналида чиқади, муаллифлар исми билан.",
      ],
      ozbekca: [
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
    age: {
      from: 10,
      to: 16,
      status: "draft",
    },
    format: {
      value: {
        uz: "Ishlar mualliflar ismi bilan chiqadi",
        oz: "Ишлар муаллифлар исми билан чиқади",
        ozbekca: "Işlar mualliflar ismi bilan çiqadi",
        ru: "Работы выходят с именами авторов",
        en: "Work goes out under the names of the authors",
      },
      status: "draft",
    },
    place: {
      value: null,
      status: "pending",
    },
    schedule: {
      value: null,
      status: "pending",
    },
    cost: {
      free: null,
      status: "pending",
    },
    teacher: {
      value: null,
      status: "pending",
    },
    highlights: {
      uz: [
        "Hikoyadan multfilmgacha bir mavsum",
        "10 yoshdan 16 yoshgacha",
        "Ishlar mualliflar ismi bilan chiqadi",
      ],
      oz: [
        "Ҳикоядан мультфильмгача бир мавсум",
        "10 ёшдан 16 ёшгача",
        "Ишлар муаллифлар исми билан чиқади",
      ],
      ozbekca: [
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
    story: {
      primary: "art-3",
      secondary: "art-7",
    },
    paper: "filmstrip",
    videoBrief: "V5",
  },
  {
    key: "rangli-olam",
    status: "draft",
    flagship: false,
    name: {
      uz: "Rangli olam",
      oz: "Рангли олам",
      ozbekca: "Rangli olam",
      ru: "Рангли олам",
      en: "Rangli olam",
    },
    tagline: {
      uz: "Tasviriy sanʼat studiyalari va koʻrgazmalar",
      oz: "Тасвирий санъат студиялари ва кўргазмалар",
      ozbekca: "Tasviriy sanʼat studiyalari va körgazmalar",
      ru: "Студии изобразительного искусства и выставки",
      en: "Fine art studios and exhibitions",
    },
    body: {
      uz: [
        "Rasm, grafika va amaliy sanʼat studiyalari. Mashgʻulotlar hafta oxirida oʻtadi, materiallar studiya hisobidan.",
        "Yil davomida yigʻilgan ishlardan viloyat koʻrgazmalari tuziladi, eng yaxshilari umumiy katalogga kiradi.",
        "Studiyaga yozilish uchun rasm chizishni bilish shart emas — boshlovchi guruhlar alohida.",
      ],
      oz: [
        "Расм, графика ва амалий санъат студиялари. Машғулотлар ҳафта охирида ўтади, материаллар студия ҳисобидан.",
        "Йил давомида йиғилган ишлардан вилоят кўргазмалари тузилади, энг яхшилари умумий каталогга киради.",
        "Студияга ёзилиш учун расм чизишни билиш шарт эмас — бошловчи гуруҳлар алоҳида.",
      ],
      ozbekca: [
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
    age: {
      from: 7,
      to: 16,
      status: "draft",
    },
    format: {
      value: {
        uz: "Yil yakunida umumiy koʻrgazma",
        oz: "Йил якунида умумий кўргазма",
        ozbekca: "Yil yakunida umumiy körgazma",
        ru: "В конце года общая выставка",
        en: "A shared exhibition at the end of the year",
      },
      status: "draft",
    },
    place: {
      value: null,
      status: "pending",
    },
    schedule: {
      value: null,
      status: "pending",
    },
    cost: {
      free: null,
      status: "pending",
    },
    teacher: {
      value: null,
      status: "pending",
    },
    highlights: {
      uz: [
        "Materiallar studiya hisobidan",
        "7 yoshdan 16 yoshgacha",
        "Yil yakunida umumiy koʻrgazma",
      ],
      oz: ["Материаллар студия ҳисобидан", "7 ёшдан 16 ёшгача", "Йил якунида умумий кўргазма"],
      ozbekca: [
        "Materiallar studiya hisobidan",
        "7 yoşdan 16 yoşgaça",
        "Yil yakunida umumiy körgazma",
      ],
      ru: ["Материалы за счёт студии", "От 7 до 16 лет", "В конце года общая выставка"],
      en: [
        "Materials paid for by the studio",
        "From 7 to 16 years old",
        "A shared exhibition at the end of the year",
      ],
    },
    story: {
      primary: "art-4",
      secondary: "art-6",
    },
    paper: "easel",
    videoBrief: "V2",
  },
];
