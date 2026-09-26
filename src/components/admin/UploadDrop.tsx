"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { fill } from "@/i18n/format";
import { MEDIA_COPY } from "@/lib/admin/copy-media";
import { UPLOAD_TYPES, type MediaPurpose } from "@/lib/admin/media/purposes";
import type { MediaItem } from "@/lib/admin/news/types";

import { AdminIcon } from "./AdminIcon";
import { UploadFailure, runLimited, uploadImage, type UploadPhase } from "./upload-client";
import { useFileDrop } from "./useFileDrop";

export interface UploadDropProps {
  readonly id: string;
  readonly purpose: MediaPurpose;
  readonly multiple?: boolean;
  readonly label: string;
  /** Tanlash tartibida, faqat muvaffaqiyatli yuklanganlar. */
  readonly onUploaded: (items: readonly MediaItem[]) => void;
  /** Yuklash boshlanganda +1, tugaganda −1: shakl shu vaqtda saqlanmaydi. */
  readonly onBusy?: (delta: 1 | -1) => void;
}

interface Job {
  readonly key: string;
  readonly name: string;
  readonly phase: UploadPhase | "done" | "failed";
  readonly share: number;
  readonly error?: string;
}

/* Telefon tarmogʻi: bir vaqtda uchtadan ortiq yuklash bir-biriga xalaqit beradi. */
const PARALLEL = 3;
const M = MEDIA_COPY;

function phaseText(job: Job): string {
  if (job.phase === "failed") return fill(M.failed, { reason: job.error ?? M.errors.server });
  if (job.phase === "uploading") return `${M.uploading} ${Math.round(job.share * 100)}%`;
  return { preparing: M.preparing, processing: M.processing, done: M.done }[job.phase];
}

/**
 * Rasm yuklash: oyna tugma koʻrinishidagi fayl tanlagich (telefonda galereyadan bir nechtasi), kompyuterda
 * sudrab tashlash ham. Har fayl uchun holat va foiz; natija tanlash tartibida qaytadi.
 */
export function UploadDrop({
  id,
  purpose,
  multiple = false,
  label,
  onUploaded,
  onBusy,
}: UploadDropProps) {
  const [jobs, setJobs] = useState<readonly Job[]>([]);
  const zone = useRef<HTMLDivElement | null>(null);
  const over = useFileDrop(zone, (files) => void start(files));

  function patch(key: string, next: Partial<Job>): void {
    setJobs((list) => list.map((job) => (job.key === key ? { ...job, ...next } : job)));
  }

  async function start(files: readonly File[]): Promise<void> {
    const picked = multiple ? files : files.slice(0, 1);
    if (!picked.length) return;
    const stamp = Date.now();
    const batch = picked.map((file, i) => ({ key: `${stamp}-${i}`, name: file.name }));
    setJobs((list) => [
      ...list.filter((job) => job.phase !== "done"),
      ...batch.map((job) => ({ ...job, phase: "preparing" as const, share: 0 })),
    ]);
    onBusy?.(1);
    try {
      const results = await runLimited(picked, PARALLEL, (file, i) => {
        const key = batch[i]?.key ?? "";
        return uploadImage(file, purpose, (phase, share) => patch(key, { phase, share })).then(
          (item) => {
            patch(key, { phase: "done", share: 1 });
            return item;
          },
          (reason: unknown) => {
            const code = reason instanceof UploadFailure ? reason.reason : "server";
            patch(key, { phase: "failed", error: M.errors[code] });
            throw reason;
          },
        );
      });
      const items = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
      if (items.length) onUploaded(items);
    } finally {
      onBusy?.(-1);
    }
  }

  const finished = jobs.filter((job) => job.phase === "done").length;
  return (
    <div
      ref={zone}
      role="group"
      aria-label={label}
      className="admin-drop"
      data-over={over ? "" : undefined}
    >
      <input
        id={id}
        type="file"
        accept={UPLOAD_TYPES.join(",")}
        multiple={multiple}
        className="sr-only"
        aria-describedby={`${id}-accept`}
        onChange={(event) => {
          const files = [...(event.target.files ?? [])];
          event.target.value = "";
          void start(files);
        }}
      />
      <div className="admin-drop-row">
        <Button asChild variant="glass" size="48" graphic={<AdminIcon name="upload" size={20} />}>
          <label htmlFor={id}>{label}</label>
        </Button>
        <span className="admin-drop-hint t-small text-ink-3">{M.drop}</span>
      </div>
      <p id={`${id}-accept`} className="t-small text-ink-3">
        {M.accept}
      </p>
      {jobs.length ? (
        <>
          <ul className="admin-uploads" aria-label={M.progress}>
            {jobs.map((job) => (
              <li key={job.key} className="admin-upload" data-phase={job.phase}>
                <span className="admin-upload-name t-small text-ink">{job.name}</span>
                <span className="admin-upload-state t-small tnum">{phaseText(job)}</span>
                {job.phase === "uploading" ? (
                  <progress max={1} value={job.share} aria-label={job.name} />
                ) : null}
              </li>
            ))}
          </ul>
          <p className="sr-only" role="status">
            {fill(M.summary, { done: finished, total: jobs.length })}
          </p>
        </>
      ) : null}
    </div>
  );
}
