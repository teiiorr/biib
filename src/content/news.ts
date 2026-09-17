import type { NewsItem } from "./types";

/**
 * YANGILIKLAR. Muqova sureti mijozdan kelgaç cover maydoni töldiriladi;
 * hozir çizilgan örinbosar işlaydi. Sana ISO şaklida, körsatiş Intl orqali.
 */
export const NEWS: readonly NewsItem[] = [
  {
    slug: "upop-trend-yangi-mavsum",
    date: "2026-08-28",
    accent: "magenta",
    topic: {
      "uz-Latn": "Kasting",
      "uz-Cyrl": "Кастинг",
      "uz-Latn-x-reform": "Kasting",
      ru: "Кастинг",
      en: "Auditions",
    },
    title: {
      "uz-Latn": "UPOP TREND yangi mavsumga ariza qabul qilmoqda",
      "uz-Cyrl": "UPOP TREND янги мавсумга ариза қабул қилмоқда",
      "uz-Latn-x-reform": "UPOP TREND yangi mavsumga ariza qabul qilmoqda",
      ru: "UPOP TREND принимает заявки на новый сезон",
      en: "UPOP TREND is taking applications for the new season",
    },
    lead: {
      "uz-Latn": "Viloyat bosqichlari kuz boshida boshlanadi. Ariza kastingning oʻz sayti orqali topshiriladi.",
      "uz-Cyrl": "Вилоят босқичлари куз бошида бошланади. Ариза кастингнинг ўз сайти орқали топширилади.",
      "uz-Latn-x-reform": "Viloyat bosqiçlari kuz boşida boşlanadi. Ariza kastingning öz sayti orqali topşiriladi.",
      ru: "Областные этапы начнутся в начале осени. Заявку подают через сайт кастинга.",
      en: "The regional rounds begin in early autumn. Applications go through the site of the auditions.",
    },
    body: {
      "uz-Latn": [
        "Yangi mavsumda tanlov barcha viloyatlarda oʻtadi. Har bir bosqichda ishtirokchi jonli chiqish qiladi va ustozlardan yozma izoh oladi. Bu izoh keyingi bosqichga oʻtmaganlarga ham beriladi.",
        "Bu yil tayyorgarlik qismi uzaytirildi: yarim finalga oʻtgan ishtirokchilar bilan ovoz va sahna ustida uch hafta ishlanadi.",
        "Ariza topshirish uchun tavsiya, hujjat yoki toʻlov talab qilinmaydi. Yosh chegarasi — 14 dan 19 gacha.",
      ],
      "uz-Cyrl": [
        "Янги мавсумда танлов барча вилоятларда ўтади. Ҳар бир босқичда иштирокчи жонли чиқиш қилади ва устозлардан ёзма изоҳ олади. Бу изоҳ кейинги босқичга ўтмаганларга ҳам берилади.",
        "Бу йил тайёргарлик қисми узайтирилди: ярим финалга ўтган иштирокчилар билан овоз ва саҳна устида уч ҳафта ишланади.",
        "Ариза топшириш учун тавсия, ҳужжат ёки тўлов талаб қилинмайди. Ёш чегараси — 14 дан 19 гача.",
      ],
      "uz-Latn-x-reform": [
        "Yangi mavsumda tanlov barça viloyatlarda ötadi. Har bir bosqiçda iştirokçi jonli çiqiş qiladi va ustozlardan yozma izoh oladi. Bu izoh keyingi bosqiçga ötmaganlarga ham beriladi.",
        "Bu yil tayyorgarlik qismi uzaytirildi: yarim finalga ötgan iştirokçilar bilan ovoz va sahna ustida uç hafta işlanadi.",
        "Ariza topşiriş uçun tavsiya, hujjat yoki tölov talab qilinmaydi. Yoş çegarasi — 14 dan 19 gaça.",
      ],
      ru: [
        "В новом сезоне конкурс пройдёт во всех областях. На каждом этапе участник выступает вживую и получает письменный разбор от наставников — его отдают и тем, кто дальше не прошёл.",
        "В этом году подготовительная часть стала длиннее: с участниками полуфинала три недели работают над голосом и сценой.",
        "Для заявки не нужны рекомендации, документы или оплата. Возраст участников — от 14 до 19 лет.",
      ],
      en: [
        "In the new season the competition runs in every region. At each round the participant performs live and receives written comments from the mentors. Children who do not go through receive them too.",
        "This year the preparation part has been made longer: participants who reach the semi-final spend three weeks working on voice and stage.",
        "No reference, papers or payment are required to apply. The age limit is 14 to 19.",
      ],
    },
    coverAlt: {
      "uz-Latn": "Sahna mikrofoni va yorugʻlik nurlari",
      "uz-Cyrl": "Саҳна микрофони ва ёруғлик нурлари",
      "uz-Latn-x-reform": "Sahna mikrofoni va yoruğlik nurlari",
      ru: "Сценический микрофон и лучи света",
      en: "A stage microphone and beams of light",
    },
  },
  {
    slug: "rangli-olam-korgazmasi",
    date: "2026-07-14",
    accent: "gold",
    topic: {
      "uz-Latn": "Koʻrgazma",
      "uz-Cyrl": "Кўргазма",
      "uz-Latn-x-reform": "Körgazma",
      ru: "Выставка",
      en: "Exhibition",
    },
    title: {
      "uz-Latn": "Rangli olam koʻrgazmasi viloyatlar boʻylab yoʻlga chiqdi",
      "uz-Cyrl": "Рангли олам кўргазмаси вилоятлар бўйлаб йўлга чиқди",
      "uz-Latn-x-reform": "Rangli olam körgazmasi viloyatlar böylab yölga çiqdi",
      ru: "Выставка «Рангли олам» отправилась по областям",
      en: "The Rangli olam exhibition sets off around the regions",
    },
    lead: {
      "uz-Latn": "Yil davomida yigʻilgan ishlardan koʻchma koʻrgazma tuzildi. Birinchi toʻxtash — Samarqand.",
      "uz-Cyrl": "Йил давомида йиғилган ишлардан кўчма кўргазма тузилди. Биринчи тўхташ — Самарқанд.",
      "uz-Latn-x-reform": "Yil davomida yiğilgan işlardan köçma körgazma tuzildi. Birinçi töxtaş — Samarqand.",
      ru: "Из работ, собранных за год, составили передвижную выставку. Первая остановка — Самарканд.",
      en: "A travelling exhibition has been put together from the work collected over the year. The first stop is Samarkand.",
    },
    body: {
      "uz-Latn": [
        "Koʻrgazmaga oltmishdan ortiq ish tanlandi: rasm, grafika va amaliy sanʼat. Tanlovni ekspertlar kengashi oʻtkazdi.",
        "Har bir ish yonida muallifning ismi, yoshi va studiyasi koʻrsatilgan. Kirish bepul.",
        "Koʻrgazma har shaharda oʻn kun turadi, keyin keyingisiga oʻtadi.",
      ],
      "uz-Cyrl": [
        "Кўргазмага олтмишдан ортиқ иш танланди: расм, графика ва амалий санъат. Танловни экспертлар кенгаши ўтказди.",
        "Ҳар бир иш ёнида муаллифнинг исми, ёши ва студияси кўрсатилган. Кириш бепул.",
        "Кўргазма ҳар шаҳарда ўн кун туради, кейин кейингисига ўтади.",
      ],
      "uz-Latn-x-reform": [
        "Körgazmaga oltmişdan ortiq iş tanlandi: rasm, grafika va amaliy sanʼat. Tanlovni ekspertlar kengaşi ötkazdi.",
        "Har bir iş yonida muallifning ismi, yoşi va studiyasi körsatilgan. Kiriş bepul.",
        "Körgazma har şaharda ön kun turadi, keyin keyingisiga ötadi.",
      ],
      ru: [
        "На выставку отобрали больше шестидесяти работ: рисунок, графика и прикладное искусство. Отбор провёл экспертный совет.",
        "Рядом с каждой работой указаны имя автора, его возраст и студия. Вход свободный.",
        "В каждом городе выставка стоит десять дней, потом едет дальше.",
      ],
      en: [
        "More than sixty pieces were chosen for the exhibition: drawing, graphic art and applied art. The selection was made by the expert council.",
        "Next to each piece is the name, the age and the studio of the author. Entry is free.",
        "The exhibition stays ten days in each city, then moves on to the next.",
      ],
    },
    coverAlt: {
      "uz-Latn": "Devorga osilgan bolalar rasmlari qatori",
      "uz-Cyrl": "Деворга осилган болалар расмлари қатори",
      "uz-Latn-x-reform": "Devorga osilgan bolalar rasmlari qatori",
      ru: "Ряд детских рисунков на стене",
      en: "A row of children’s drawings hung on a wall",
    },
  },
  {
    slug: "sahna-bolalari-yangi-studiyalar",
    date: "2026-06-03",
    accent: "violet",
    topic: {
      "uz-Latn": "Studiya",
      "uz-Cyrl": "Студия",
      "uz-Latn-x-reform": "Studiya",
      ru: "Студия",
      en: "Studios",
    },
    title: {
      "uz-Latn": "Sahna bolalari uchta yangi tumanda ochildi",
      "uz-Cyrl": "Саҳна болалари учта янги туманда очилди",
      "uz-Latn-x-reform": "Sahna bolalari uçta yangi tumanda oçildi",
      ru: "Студии «Сахна болалари» открылись в трёх новых районах",
      en: "Sahna bolalari has opened in three new districts",
    },
    lead: {
      "uz-Latn": "Mashgʻulotlar maktab binolarida, hafta oxirida oʻtadi. Guruhlar toʻldirilmoqda.",
      "uz-Cyrl": "Машғулотлар мактаб биноларида, ҳафта охирида ўтади. Гуруҳлар тўлдирилмоқда.",
      "uz-Latn-x-reform": "Maşğulotlar maktab binolarida, hafta oxirida ötadi. Guruhlar töldirilmoqda.",
      ru: "Занятия проходят в школьных зданиях по выходным. Группы набираются.",
      en: "Classes are held in school buildings at the weekend. The groups are filling up.",
    },
    body: {
      "uz-Latn": [
        "Yangi studiyalar mahalliy maktablar bilan kelishilgan holda ochildi: bino maktabniki, dastur va ustoz birlashmaniki.",
        "Har bir guruhda oʻn ikkitagacha bola. Mashgʻulot haftasiga ikki marta, bir yarim soatdan.",
        "Yozilish uchun aloqa sahifasidagi shakl orqali yozish yoki toʻgʻridan-toʻgʻri qoʻngʻiroq qilish mumkin.",
      ],
      "uz-Cyrl": [
        "Янги студиялар маҳаллий мактаблар билан келишилган ҳолда очилди: бино мактабники, дастур ва устоз бирлашманики.",
        "Ҳар бир гуруҳда ўн иккитагача бола. Машғулот ҳафтасига икки марта, бир ярим соатдан.",
        "Ёзилиш учун алоқа саҳифасидаги шакл орқали ёзиш ёки тўғридан-тўғри қўнғироқ қилиш мумкин.",
      ],
      "uz-Latn-x-reform": [
        "Yangi studiyalar mahalliy maktablar bilan kelişilgan holda oçildi: bino maktabniki, dastur va ustoz birlaşmaniki.",
        "Har bir guruhda ön ikkitagaça bola. Maşğulot haftasiga ikki marta, bir yarim soatdan.",
        "Yoziliş uçun aloqa sahifasidagi şakl orqali yoziş yoki töğridan-töğri qönğiroq qiliş mumkin.",
      ],
      ru: [
        "Новые студии открыли по договорённости с местными школами: здание школьное, программа и наставник от объединения.",
        "В каждой группе до двенадцати детей. Занятия два раза в неделю, по полтора часа.",
        "Записаться можно через форму на странице контактов или по телефону.",
      ],
      en: [
        "The new studios were opened in agreement with the local schools: the building is the school’s, the programme and the mentor are the association’s.",
        "There are up to twelve children in each group. Classes run twice a week, an hour and a half at a time.",
        "To sign up, write through the form on the contact page or call us directly.",
      ],
    },
    coverAlt: {
      "uz-Latn": "Teatr pardasi va bolalar guruhi mashgʻulotda",
      "uz-Cyrl": "Театр пардаси ва болалар гуруҳи машғулотда",
      "uz-Latn-x-reform": "Teatr pardasi va bolalar guruhi maşğulotda",
      ru: "Театральный занавес и группа детей на занятии",
      en: "A theatre curtain and a group of children in class",
    },
  },
  {
    slug: "ustozlar-uchun-seminar",
    date: "2026-05-20",
    accent: "turquoise",
    topic: {
      "uz-Latn": "Taʼlim",
      "uz-Cyrl": "Таълим",
      "uz-Latn-x-reform": "Taʼlim",
      ru: "Обучение",
      en: "Training",
    },
    title: {
      "uz-Latn": "Studiya ustozlari uchun yozgi seminar oʻtkazildi",
      "uz-Cyrl": "Студия устозлари учун ёзги семинар ўтказилди",
      "uz-Latn-x-reform": "Studiya ustozlari uçun yozgi seminar ötkazildi",
      ru: "Для наставников студий прошёл летний семинар",
      en: "A summer seminar was held for studio mentors",
    },
    lead: {
      "uz-Latn": "Toʻrt kunlik seminarda oʻquv dasturi, guruh bilan ishlash va baholash muhokama qilindi.",
      "uz-Cyrl": "Тўрт кунлик семинарда ўқув дастури, гуруҳ билан ишлаш ва баҳолаш муҳокама қилинди.",
      "uz-Latn-x-reform": "Tört kunlik seminarda öquv dasturi, guruh bilan işlaş va baholaş muhokama qilindi.",
      ru: "За четыре дня семинара обсудили учебную программу, работу с группой и оценивание.",
      en: "Over four days the seminar went through the study programme, working with a group and assessment.",
    },
    body: {
      "uz-Latn": [
        "Seminarga toʻrt yoʻnalishdagi studiyalardan ustozlar yigʻildi. Asosiy mavzu: bir guruhda turli tayyorgarlikdagi bolalar bilan ishlash.",
        "Amaliy qismda ustozlar bir-birining mashgʻulotini kuzatdi va yozma tahlil qildi.",
        "Seminar materiallari studiyalarga tarqatildi va keyingi mavsumda dasturga kiritiladi.",
      ],
      "uz-Cyrl": [
        "Семинарга тўрт йўналишдаги студиялардан устозлар йиғилди. Асосий мавзу: бир гуруҳда турли тайёргарликдаги болалар билан ишлаш.",
        "Амалий қисмда устозлар бир-бирининг машғулотини кузатди ва ёзма таҳлил қилди.",
        "Семинар материаллари студияларга тарқатилди ва кейинги мавсумда дастурга киритилади.",
      ],
      "uz-Latn-x-reform": [
        "Seminarga tört yönalişdagi studiyalardan ustozlar yiğildi. Asosiy mavzu: bir guruhda turli tayyorgarlikdagi bolalar bilan işlaş.",
        "Amaliy qismda ustozlar bir-birining maşğulotini kuzatdi va yozma tahlil qildi.",
        "Seminar materiallari studiyalarga tarqatildi va keyingi mavsumda dasturga kiritiladi.",
      ],
      ru: [
        "На семинар собрались наставники студий всех четырёх направлений. Главная тема — работа с детьми разной подготовки в одной группе.",
        "В практической части наставники приходили на занятия друг к другу и писали разбор.",
        "Материалы семинара разослали по студиям, в следующем сезоне они войдут в программу.",
      ],
      en: [
        "Mentors from studios in all four directions came to the seminar. The main subject was working with children of different levels in one group.",
        "In the practical part the mentors watched each other’s classes and wrote up what they saw.",
        "The seminar material was sent out to the studios and goes into the programme next season.",
      ],
    },
    coverAlt: {
      "uz-Latn": "Doira shaklida oʻtirgan ustozlar va doskadagi yozuvlar",
      "uz-Cyrl": "Доира шаклида ўтирган устозлар ва доскадаги ёзувлар",
      "uz-Latn-x-reform": "Doira şaklida ötirgan ustozlar va doskadagi yozuvlar",
      ru: "Наставники сидят в кругу, на доске записи",
      en: "Mentors sitting in a circle and notes on a board",
    },
  },
  {
    slug: "ertak-ustaxonasi-birinchi-multfilmlar",
    date: "2026-04-11",
    accent: "green",
    topic: {
      "uz-Latn": "Loyiha",
      "uz-Cyrl": "Лойиҳа",
      "uz-Latn-x-reform": "Loyiha",
      ru: "Проект",
      en: "Project",
    },
    title: {
      "uz-Latn": "Ertak ustaxonasining birinchi multfilmlari chiqdi",
      "uz-Cyrl": "Эртак устахонасининг биринчи мультфильмлари чиқди",
      "uz-Latn-x-reform": "Ertak ustaxonasining birinçi multfilmlari çiqdi",
      ru: "Вышли первые мультфильмы мастерской «Эртак устахонаси»",
      en: "The first films from Ertak ustaxonasi are out",
    },
    lead: {
      "uz-Latn": "Bolalar yozgan olti hikoya qisqa multfilmga aylandi. Ishlar mualliflar ismi bilan eʼlon qilindi.",
      "uz-Cyrl": "Болалар ёзган олти ҳикоя қисқа мультфильмга айланди. Ишлар муаллифлар исми билан эълон қилинди.",
      "uz-Latn-x-reform": "Bolalar yozgan olti hikoya qisqa multfilmga aylandi. Işlar mualliflar ismi bilan eʼlon qilindi.",
      ru: "Шесть историй, написанных детьми, стали короткими мультфильмами. Работы опубликованы с именами авторов.",
      en: "Six stories written by children have become short animated films. The work has been published under the names of the authors.",
    },
    body: {
      "uz-Latn": [
        "Har bir multfilm uch-toʻrt daqiqa. Hikoyani bola yozgan, rasmni studiya guruhi chizgan, ovozni mualliflarning oʻzi bergan.",
        "Ustaxona bir mavsum davom etdi: birinchi oyda matn, keyin storibord, oxirgi oylarda rasm va montaj.",
        "Keyingi mavsumga yozilish kuzda ochiladi.",
      ],
      "uz-Cyrl": [
        "Ҳар бир мультфильм уч-тўрт дақиқа. Ҳикояни бола ёзган, расмни студия гуруҳи чизган, овозни муаллифларнинг ўзи берган.",
        "Устахона бир мавсум давом этди: биринчи ойда матн, кейин сториборд, охирги ойларда расм ва монтаж.",
        "Кейинги мавсумга ёзилиш кузда очилади.",
      ],
      "uz-Latn-x-reform": [
        "Har bir multfilm uç-tört daqiqa. Hikoyani bola yozgan, rasmni studiya guruhi çizgan, ovozni mualliflarning özi bergan.",
        "Ustaxona bir mavsum davom etdi: birinçi oyda matn, keyin storibord, oxirgi oylarda rasm va montaj.",
        "Keyingi mavsumga yoziliş kuzda oçiladi.",
      ],
      ru: [
        "Каждый мультфильм идёт три-четыре минуты. Историю написал ребёнок, рисунки сделала студийная группа, озвучили авторы сами.",
        "Мастерская шла один сезон: первый месяц текст, потом раскадровка, последние месяцы рисунок и монтаж.",
        "Запись на следующий сезон откроется осенью.",
      ],
      en: [
        "Each film is three or four minutes long. The story was written by a child, the drawings were made by the studio group, and the children did the voices themselves.",
        "The workshop ran for one season: the text in the first month, then the storyboard, and the drawing and editing in the final months.",
        "Sign-up for the next season opens in autumn.",
      ],
    },
    coverAlt: {
      "uz-Latn": "Ochiq kitob va undan chiqayotgan chizilgan qahramonlar",
      "uz-Cyrl": "Очиқ китоб ва ундан чиқаётган чизилган қаҳрамонлар",
      "uz-Latn-x-reform": "Oçiq kitob va undan çiqayotgan çizilgan qahramonlar",
      ru: "Раскрытая книга и выходящие из неё нарисованные герои",
      en: "An open book with drawn characters coming out of it",
    },
  },
];
