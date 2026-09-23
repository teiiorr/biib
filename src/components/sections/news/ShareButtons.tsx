"use client";

import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import type { Dictionary } from "@/i18n/dictionaries";

interface ShareButtonsProps {
  readonly url: string;
  readonly title: string;
  readonly dict: Dictionary["common"]["actions"];
}

/** Telegramda ulashish va havolani nusxalash: ikkita oyna tugma. */
export function ShareButtons({ url, title, dict }: ShareButtonsProps) {
  const share = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  return (
    <div className="share-buttons">
      <Button variant="glass" size="40" icon="telegram" asChild>
        <a href={share} target="_blank" rel="noopener noreferrer">
          <span className="text-trim">{dict.shareTelegram}</span>
        </a>
      </Button>
      <CopyButton
        value={url}
        label={dict.copyLink}
        copiedLabel={dict.linkCopied}
        variant="glass"
        size="40"
      />
    </div>
  );
}
