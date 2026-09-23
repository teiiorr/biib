"use client";

import { useEffect, useState } from "react";

import { Surface } from "@/components/glass/Surface";

interface ProjectsLocalNavProps {
  readonly items: ReadonlyArray<{ readonly id: string; readonly label: string }>;
  readonly label: string;
}

/** Loyihalar boʻyicha yopishqoq oyna navigatsiya (kompyuter): faol boʻlim kuzatiladi. */
export function ProjectsLocalNav({ items, label }: ProjectsLocalNavProps) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5] },
    );
    for (const s of sections) io.observe(s);
    return () => io.disconnect();
  }, [items]);

  return (
    <div className="projects-localnav hidden lg:block">
      <Surface
        as="nav"
        radius="control"
        padding={4}
        text
        adaptiveTone
        aria-label={label}
        className="projects-localnav-bar"
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="nav-item t-label"
            data-active={active === item.id ? "true" : undefined}
          >
            <span className="text-trim">{item.label}</span>
          </a>
        ))}
      </Surface>
    </div>
  );
}
