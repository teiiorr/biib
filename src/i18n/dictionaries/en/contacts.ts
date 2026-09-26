import type { contacts as source } from "../uz/contacts";

export const contacts: typeof source = {
  title: "Contacts",
  details: {
    heading: "Details",
    address: "Address",
    phone: "Phone",
    email: "Email",
    telegram: "Telegram",
    hours: "Working hours",
    copy: "Copy",
    copied: "Copied",
  },
  map: {
    yandex: "Open in Yandex Maps",
    google: "Open in Google Maps",
  },
  form: {
    heading: "Send a message",
    name: "Your name",
    contact: "Phone or email",
    message: "Message",
    consent: "I agree to the processing of my details under the {privacy}",
    consentLink: "privacy policy",
    submit: "Send",
    sending: "Sending",
    success: "Message sent. Thank you, we will answer soon.",
    error: "Could not send. Write on Telegram or try again later.",
    tooFast: "The form was filled in too quickly, please send it again.",
    required: "This field is required",
    invalidContact: "Enter a phone number or an email address",
    tooShort: "The message should be at least {min} characters",
    consentRequired: "Consent is needed to send",
    fallbackHeading: "Write on Telegram",
    fallbackCta: "Write on Telegram",
  },
  socials: {
    heading: "Social media",
  },
};
