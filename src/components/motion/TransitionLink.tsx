"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { addTransitionType, startTransition, type ComponentProps } from "react";
import { DURATION } from "@/lib/motion/constants";
import {
  hrefToPath,
  inferDirection,
  markNavEntry,
  NAV_FADE_CLASS,
  supportsViewTransitions,
  type NavDirection,
  type TransitionType,
} from "@/lib/motion/transitions";

type LinkProps = ComponentProps<typeof Link>;
type NavigateHandler = NonNullable<LinkProps["onNavigate"]>;

export interface TransitionLinkProps extends Omit<LinkProps, "href"> {
  readonly href: string;
  /** Yoʻnalishni majburlash; berilmasa tarix va chuqurlikdan aniqlanadi. */
  readonly direction?: NavDirection;
  /** Masalan LOCALE_SWITCH: til almashtirgichda yoʻnalish oʻrniga. */
  readonly transitionType?: TransitionType;
}

let fadeTimer: number | undefined;

/** View Transitions boʻlmagan brauzer: body ga sinf, PageTransition yangi yoʻlda olib tashlaydi. */
function beginFallbackFade(): void {
  document.body.classList.add(NAV_FADE_CLASS);
  window.clearTimeout(fadeTimer);
  fadeTimer = window.setTimeout(
    () => document.body.classList.remove(NAV_FADE_CLASS),
    DURATION.fade * 1000 * 3,
  );
}

/**
 * next/link ustidagi oʻram: SPA oʻtishda startTransition + addTransitionType(nav-forward|nav-back)
 * bilan router.push/replace. Modifikator tugmalar, tashqi havolalar va prefetch odatdagidek.
 */
export function TransitionLink({
  href,
  direction,
  transitionType,
  onNavigate,
  ...rest
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate: NavigateHandler = (event) => {
    // Tashqi onNavigate oʻzi toʻxtatgan boʻlsa, oʻtish ham, tur ham qoʻshilmaydi.
    let prevented = false;
    onNavigate?.({
      preventDefault: () => {
        prevented = true;
        event.preventDefault();
      },
    });
    if (prevented) return;
    event.preventDefault();

    const type = transitionType ?? direction ?? inferDirection(pathname, hrefToPath(href));
    if (!supportsViewTransitions()) beginFallbackFade();
    markNavEntry();

    const options = rest.scroll === undefined ? undefined : { scroll: rest.scroll };
    startTransition(() => {
      addTransitionType(type);
      if (rest.replace) router.replace(href, options);
      else router.push(href, options);
    });
  };

  return <Link {...rest} href={href} onNavigate={handleNavigate} />;
}
