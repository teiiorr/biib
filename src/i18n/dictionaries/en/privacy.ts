import type { privacy as source } from "../uz/privacy";

export const privacy: typeof source = {
  title: "Privacy policy",
  updated: "Updated: {date}",
  kid: {
    heading: "In short, in plain words",
    items: [
      "We collect nothing about you: the site has no sign-up, comments or likes.",
      "Your drawing or photo appears on the site only if your parents agree and you want it to.",
      "If you want your drawing taken down, your parents write to us and we take it down.",
    ],
  },
  sections: [
    {
      id: "collected",
      heading: "What is collected and where it goes",
      paragraphs: [
        "The name, phone or email and message text sent through the contact form. Nothing else: the site has no accounts, comments, cookies or analytics.",
        "Appearance settings (transparency, density, motion and sound) are kept only in your browser, in localStorage, and are never sent to us.",
        "The form sends the message to the association’s service chat through the Telegram Bot API, so the data passes through Telegram’s servers.",
      ],
    },
    {
      id: "purpose",
      heading: "Why and for how long",
      paragraphs: [
        "To answer your message and consider your request. The details are not passed to third parties or used for advertising.",
        "A message is kept until the request is resolved and for no longer than 12 months, then deleted.",
      ],
    },
    {
      id: "children",
      heading: "Children’s work and photos",
      paragraphs: [
        "A child’s drawing or photo is published only with written parental consent and the child’s own wish. Only the first name, age and region are shown; never the school or an exact address.",
        "Consent can be withdrawn at any time: write to the address on the contacts page and the work is removed within two working days.",
      ],
    },
    {
      id: "rights",
      heading: "Your rights",
      paragraphs: [
        "You may ask for, correct or delete the details we hold about you. Send requests and privacy questions to the email address on the contacts page.",
        "These rights are set out in the Law of the Republic of Uzbekistan “On Personal Data” (No. ZRU-547 of 2 July 2019).",
      ],
    },
  ],
};
