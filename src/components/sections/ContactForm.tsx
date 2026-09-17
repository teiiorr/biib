"use client";

import { useActionState, useId, useRef, useState, type FocusEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Toast } from "@/components/ui/Toast";
import { submitContact } from "@/app/[locale]/contacts/actions";
import {
  INITIAL_CONTACT_STATE,
  MESSAGE_MAX,
  MESSAGE_MIN,
  validateField,
  type ContactField,
  type ErrorKey,
} from "@/app/[locale]/contacts/contact-schema";

const FIELDS = ["name", "email", "phone", "topic", "message"] as const;

/**
 * Tekşiruv maydondan çiqqanda va yuborişda — har harfda emas (§6.8).
 * Blur natijasi server natijasining ustiga yoziladi: tözatilgan maydon
 * darrov toza bölib qoladi.
 */
export function ContactForm() {
  const t = useTranslations("form");
  const tCommon = useTranslations("common");
  const [state, action, pending] = useActionState(submitContact, INITIAL_CONTACT_STATE);
  const [blurErrors, setBlurErrors] = useState<Partial<Record<ContactField, ErrorKey | undefined>>>(
    {},
  );
  const [toastClosed, setToastClosed] = useState(false);
  const baseId = useId();
  const summary = useRef<HTMLDivElement>(null);

  const errors = { ...(state.fieldErrors ?? {}), ...blurErrors };
  const invalid = FIELDS.filter((field) => errors[field]);

  function idOf(field: ContactField) {
    return `${baseId}-${field}`;
  }

  function onBlur(field: ContactField) {
    return (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (field === "phone" && event.target.value.trim() === "") {
        setBlurErrors((prev) => ({ ...prev, phone: undefined }));
        return;
      }
      setBlurErrors((prev) => ({ ...prev, [field]: validateField(field, event.target.value) }));
    };
  }

  function messageFor(field: ContactField): string | undefined {
    const key = errors[field];
    if (!key) return undefined;
    if (key === "tooShort") return t("tooShort", { min: MESSAGE_MIN });
    if (key === "tooLong") return t("tooLong", { max: MESSAGE_MAX });
    if (key === "invalidEmail") return t("invalidEmail");
    return t("required");
  }

  function common(field: ContactField) {
    return {
      id: idOf(field),
      name: field,
      onBlur: onBlur(field),
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby": errors[field] ? `${idOf(field)}-error` : undefined,
    } as const;
  }

  const showError = state.status === "error" && (invalid.length > 0 || state.delivery);

  return (
    <>
      <form action={action} noValidate onInput={() => setToastClosed(false)} className="flex flex-col gap-5">
        {showError ? (
          <div
            ref={summary}
            tabIndex={-1}
            className="rounded-md bg-elevated p-4 shadow-[inset_0_0_0_1.5px_var(--danger)]"
          >
            <p className="text-callout font-semibold text-label">{t("errorHeading")}</p>
            {invalid.length > 0 ? (
              <>
                <p className="mt-1 text-footnote text-label-secondary">{t("errorSummary")}</p>
                <ul className="mt-2 flex flex-col gap-1">
                  {invalid.map((field) => (
                    <li key={field}>
                      <a href={`#${idOf(field)}`} className="text-footnote font-semibold text-danger">
                        {t(field)}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-1 text-footnote text-label-secondary">{t("errorBody")}</p>
            )}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={idOf("name")} label={t("name")} error={messageFor("name")}>
            <Input
              {...common("name")}
              autoComplete="name"
              required
              maxLength={80}
              placeholder={t("namePlaceholder")}
            />
          </Field>

          <Field id={idOf("email")} label={t("email")} error={messageFor("email")}>
            <Input
              {...common("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              maxLength={120}
              placeholder={t("emailPlaceholder")}
            />
          </Field>

          <Field
            id={idOf("phone")}
            label={t("phone")}
            hint={t("phoneHint")}
            error={messageFor("phone")}
          >
            <Input
              {...common("phone")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={40}
              placeholder={t("phonePlaceholder")}
            />
          </Field>

          <Field id={idOf("topic")} label={t("topic")} error={messageFor("topic")}>
            <Input {...common("topic")} required maxLength={120} placeholder={t("topicPlaceholder")} />
          </Field>
        </div>

        <Field id={idOf("message")} label={t("message")} error={messageFor("message")}>
          <Textarea
            {...common("message")}
            required
            minLength={MESSAGE_MIN}
            maxLength={MESSAGE_MAX}
            rows={6}
            placeholder={t("messagePlaceholder")}
          />
        </Field>

        {/* Asal qopqon: ekranda ham, öqigiçda ham körinmaydi. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={`${baseId}-company`}>Company</label>
          <input id={`${baseId}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" loading={pending}>
            {pending ? t("submitting") : t("submit")}
          </Button>
        </div>
      </form>

      <Toast
        open={state.status === "success" && !toastClosed}
        onClose={() => setToastClosed(true)}
        title={t("successHeading")}
        description={t("successBody")}
        closeLabel={tCommon("close")}
      />
    </>
  );
}
