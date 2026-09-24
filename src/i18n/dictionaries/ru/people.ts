import type { people as source } from "../uz/people";

export const people: typeof source = {
  experts: {
    title: "Экспертный совет",
    lead: "Совет рассматривает программы студий и оценивает работы на кастинге и выставках.",
    field: "Направление",
    role: "Задача",
    bio: "Кратко",
    open: "Подробнее",
    pending: "Имена и фото членов совета ожидают подтверждения объединения",
  },
  leadership: {
    title: "Руководство",
    lead: "Руководство объединения и порядок приёма.",
    position: "Должность",
    reception: "Дни приёма",
    receptionPending: "Дни приёма ожидают подтверждения",
    email: "Официальная почта",
    emailPending: "Адрес почты ожидает подтверждения",
    day: "День",
    hours: "Часы",
    pending: "Имя и фото руководителя ожидают подтверждения объединения",
  },
  portraitAlt: "Портрет: {name}",
  placeholderAlt: "Пустое место для портрета в форме арки",
  dialogLabel: "Подробнее: {name}",
};
