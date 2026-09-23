"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Field } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import { fireConfetti } from "@/designs/birlashma/confetti";
import { sendContact } from "@/lib/contact/action";
import { MIN_MESSAGE, type ContactState } from "@/lib/contact/schema";

interface ContactFormProps {
  readonly dict: Dictionary["contacts"]["form"];
  readonly privacyHref: string;
}

const INITIAL: ContactState = { status: "idle" };

/** Aloqa shakli: ism, telefon yoki pochta, xabar, rozilik; tuzoq va minimal toʻldirish vaqti. */
export function ContactForm({ dict, privacyHref }: ContactFormProps) {
  const [state, action, pending] = useActionState(sendContact, INITIAL);
  const [startedAt] = useState(() => Date.now());
  const id = useId();
  const submitRef = useRef<HTMLDivElement | null>(null);
  /* Birlashma: yuborilgach qogʻoz konfetti, faqat shu dizaynda va sessiyada bir marta. */
  useEffect(() => {
    if (state.status !== "success") return;
    if (document.documentElement.getAttribute("data-design") !== "birlashma") return;
    const rect = submitRef.current?.getBoundingClientRect();
    if (rect) fireConfetti({ x: rect.left + rect.width / 2, y: rect.top }, "contact-form");
  }, [state.status]);
  const errorText = (key: keyof NonNullable<ContactState["errors"]>): string | undefined => {
    const code = state.errors?.[key];
    if (!code) return undefined;
    if (code === "tooShort") return fill(dict.tooShort, { min: MIN_MESSAGE });
    return dict[code];
  };
  const consentLabel = dict.consent.split("{privacy}");

  return (
    <form action={action} className="contact-form" data-testid="contact-form" noValidate>
      <Field id={`${id}-name`} label={dict.name} required error={errorText("name")}>
        {(control) => (
          <Input {...control} name="name" autoComplete="name" enterKeyHint="next" maxLength={80} />
        )}
      </Field>
      <Field id={`${id}-contact`} label={dict.contact} required error={errorText("contact")}>
        {(control) => (
          <Input
            {...control}
            name="contact"
            autoComplete="tel email"
            inputMode="email"
            enterKeyHint="next"
            maxLength={80}
          />
        )}
      </Field>
      <Field id={`${id}-message`} label={dict.message} required error={errorText("message")}>
        {(control) => (
          <Textarea {...control} name="message" rows={5} enterKeyHint="enter" maxLength={2000} />
        )}
      </Field>
      <Checkbox
        id={`${id}-consent`}
        name="consent"
        required
        aria-invalid={state.errors?.consent ? true : undefined}
        label={
          <>
            {consentLabel[0]}
            <Link href={privacyHref} className="text-tint underline">
              {dict.consentLink}
            </Link>
            {consentLabel[1]}
          </>
        }
      />
      {state.errors?.consent ? (
        <FormMessage tone="error">{dict.consentRequired}</FormMessage>
      ) : null}
      {/* Bot tuzogʻi: odam koʻrmaydi va toʻldirmaydi. */}
      <div className="contact-trap" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />
      <div className="contact-submit" ref={submitRef}>
        <Button type="submit" variant="primary" size="56" loading={pending}>
          {pending ? dict.sending : dict.submit}
        </Button>
      </div>
      {state.status === "success" ? <FormMessage tone="success">{dict.success}</FormMessage> : null}
      {state.status === "error" ? <FormMessage tone="error">{dict.error}</FormMessage> : null}
      {state.status === "tooFast" ? <FormMessage tone="error">{dict.tooFast}</FormMessage> : null}
    </form>
  );
}
