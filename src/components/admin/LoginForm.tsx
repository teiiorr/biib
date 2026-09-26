"use client";

import { useActionState, useId, useState } from "react";

import { Surface } from "@/components/glass/Surface";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { signIn } from "@/lib/admin/actions/auth";
import { SIGN_IN_IDLE } from "@/lib/admin/auth-state";
import { ADMIN_COPY } from "@/lib/admin/copy";
import type { AdminPath } from "@/lib/admin/paths";

import { AdminIcon } from "./AdminIcon";

interface LoginFormProps {
  /** Kirishdan keyin qaytiladigan panel sahifasi (serverda tekshirilgan). */
  readonly next: AdminPath;
  /** Server sozlamalari toʻliq emas: shakl koʻrinadi, lekin yuborilmaydi. */
  readonly closed: boolean;
}

const T = ADMIN_COPY.login;

/** Kirish shakli: pochta va parol, bitta umumiy xato matni (qaysi maydon notoʻgʻriligi aytilmaydi). */
export function LoginForm({ next, closed }: LoginFormProps) {
  const [state, action, pending] = useActionState(signIn, SIGN_IN_IDLE);
  const id = useId();
  /* Telefonda parolni xatosiz terish uchun: koʻz tugmasi uni vaqtincha matn qilib koʻrsatadi. */
  const [visible, setVisible] = useState(false);
  const status = closed ? "closed" : state.status;
  const message = status === "invalid" ? T.invalid : status === "closed" ? T.closed : null;
  return (
    <Surface as="div" radius="panel" padding={24} text className="admin-login-panel">
      <form action={action} className="admin-form" aria-label={T.formLabel}>
        <input type="hidden" name="next" value={next} />
        <Field id={`${id}-email`} label={T.email} required requiredLabel={T.required}>
          {(control) => (
            <Input
              {...control}
              name="email"
              type="email"
              autoComplete="username"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="next"
              maxLength={254}
              defaultValue={state.email ?? ""}
            />
          )}
        </Field>
        <Field id={`${id}-password`} label={T.password} required requiredLabel={T.required}>
          {(control) => (
            <span className="admin-password">
              <Input
                {...control}
                name="password"
                type={visible ? "text" : "password"}
                autoComplete="current-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                maxLength={512}
              />
              <button
                type="button"
                className="admin-password-toggle"
                aria-label={visible ? T.hidePassword : T.showPassword}
                aria-pressed={visible}
                onClick={() => setVisible((v) => !v)}
              >
                <AdminIcon name={visible ? "eye-off" : "eye"} size={20} />
              </button>
            </span>
          )}
        </Field>
        <FormMessage tone="error">{message}</FormMessage>
        <div className="admin-actions">
          <Button
            type="submit"
            variant="primary"
            size="48"
            loading={pending}
            disabled={closed}
            data-testid="admin-login-submit"
          >
            {pending ? T.submitting : T.submit}
          </Button>
        </div>
      </form>
    </Surface>
  );
}
