"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import {
  INITIAL_CONTACT_STATE,
  submitContact,
  type ContactField,
} from "@/app/[locale]/contacts/actions";
import { cn } from "@/lib/cn";

const FIELDS = ["name", "email", "phone", "topic", "message"] as const;

/** Xabar şakli. Xato bölsa — röyxat tepada, fokus öşa yerga köçadi. */
export function ContactForm() {
  const t = useTranslations("form");
  const [state, action, pending] = useActionState(submitContact, INITIAL_CONTACT_STATE);
  const baseId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const errors = state.fieldErrors ?? {};
  const hasFieldErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  function idOf(field: ContactField) {
    return `${baseId}-${field}`;
  }

  function messageFor(field: ContactField): string | undefined {
    const key = errors[field];
    if (!key) return undefined;
    if (key === "tooShort") return t("tooShort", { min: state.minLength ?? 10 });
    if (key === "tooLong") return t("tooLong", { max: 2000 });
    if (key === "invalidEmail") return t("invalidEmail");
    return t("required");
  }

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-6">
      <div aria-live="polite" className="contents">
        {state.status === "success" ? (
          <div className="rounded-card border-2 border-grass bg-grass-soft p-5">
            <div>
              <p className="font-display text-[1.1rem] font-bold text-ink">{t("successHeading")}</p>
              <p className="mt-1 text-[1rem] text-ink-2">{t("successBody")}</p>
            </div>
          </div>
        ) : null}

        {state.status === "error" ? (
          <div
            ref={summaryRef}
            tabIndex={-1}
            className="rounded-card border-2 border-coral-ink bg-coral-soft p-5 focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
          >
            <p className="font-display text-[1.1rem] font-bold text-ink">{t("errorHeading")}</p>
            {hasFieldErrors ? (
              <>
                <p className="mt-1 text-[1rem] text-ink-2">{t("errorSummary")}</p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {FIELDS.filter((field) => errors[field]).map((field) => (
                    <li key={field}>
                      <a
                        href={`#${idOf(field)}`}
                        className="text-[0.98rem] font-semibold text-coral-ink underline underline-offset-4"
                      >
                        {t(field)}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-1 text-[1rem] text-ink-2">{t("errorBody")}</p>
            )}
          </div>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={idOf("name")} label={t("name")} error={messageFor("name")}>
          <Input
            id={idOf("name")}
            name="name"
            autoComplete="name"
            required
            maxLength={80}
            placeholder={t("namePlaceholder")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${idOf("name")}-error` : undefined}
          />
        </Field>

        <Field id={idOf("email")} label={t("email")} error={messageFor("email")}>
          <Input
            id={idOf("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={120}
            placeholder={t("emailPlaceholder")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${idOf("email")}-error` : undefined}
          />
        </Field>

        <Field
          id={idOf("phone")}
          label={t("phone")}
          hint={t("phoneHint")}
          error={messageFor("phone")}
        >
          <Input
            id={idOf("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={40}
            placeholder={t("phonePlaceholder")}
            aria-describedby={`${idOf("phone")}-hint`}
          />
        </Field>

        <Field id={idOf("topic")} label={t("topic")} error={messageFor("topic")}>
          <Input
            id={idOf("topic")}
            name="topic"
            required
            maxLength={120}
            placeholder={t("topicPlaceholder")}
            aria-invalid={Boolean(errors.topic)}
            aria-describedby={errors.topic ? `${idOf("topic")}-error` : undefined}
          />
        </Field>
      </div>

      <Field id={idOf("message")} label={t("message")} error={messageFor("message")}>
        <Textarea
          id={idOf("message")}
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          placeholder={t("messagePlaceholder")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${idOf("message")}-error` : undefined}
        />
      </Field>

      {/* Asal qopqon: ekranda ham, öqigiçda ham körinmaydi. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${baseId}-company`}>Company</label>
        <input id={`${baseId}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg" disabled={pending} className={cn(pending && "opacity-70")}>
          {pending ? t("submitting") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
