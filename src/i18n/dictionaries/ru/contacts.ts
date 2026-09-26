import type { contacts as source } from "../uz/contacts";

export const contacts: typeof source = {
  title: "Контакты",
  details: {
    heading: "Контактные данные",
    address: "Адрес",
    phone: "Телефон",
    email: "Почта",
    telegram: "Telegram",
    hours: "Часы работы",
    copy: "Скопировать",
    copied: "Скопировано",
  },
  map: {
    yandex: "Яндекс Карты",
    google: "Google Карты",
  },
  form: {
    heading: "Написать нам",
    name: "Ваше имя",
    contact: "Телефон или почта",
    message: "Сообщение",
    consent: "Даю согласие на обработку моих данных согласно {privacy}",
    consentLink: "политике конфиденциальности",
    submit: "Отправить",
    sending: "Отправляем",
    success: "Сообщение отправлено. Спасибо, скоро ответим.",
    error: "Не удалось отправить. Напишите в Telegram или попробуйте позже.",
    tooFast: "Форма заполнена слишком быстро, отправьте ещё раз.",
    required: "Это поле обязательно",
    invalidContact: "Введите номер телефона или адрес почты",
    tooShort: "Сообщение должно быть не короче {min} символов",
    consentRequired: "Для отправки нужно согласие",
    fallbackHeading: "Напишите в Telegram",
    fallbackCta: "Написать в Telegram",
  },
  socials: {
    heading: "Соцсети",
  },
};
