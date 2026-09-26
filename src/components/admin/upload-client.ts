import type { MediaPurpose, UploadType } from "@/lib/admin/media/purposes";
import { UPLOAD_MAX_BYTES, UPLOAD_TYPES } from "@/lib/admin/media/purposes";
import type { MediaItem } from "@/lib/admin/news/types";

/* Telefon surati 12–48 MP: serverga 2560 px dan katta yuborilmaydi, yuklash bir necha barobar tez. */
const LONG_EDGE = 2560;
const QUALITY = 0.92;

export type UploadError = "type" | "size" | "network" | "server" | "unreadable" | "denied";

export class UploadFailure extends Error {
  constructor(readonly reason: UploadError) {
    super(reason);
  }
}

function isUploadType(type: string): type is UploadType {
  return (UPLOAD_TYPES as readonly string[]).includes(type);
}

function canvasBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

/**
 * Brauzerda kichraytirish: EXIF burilishi qoʻllanadi va metamaʼlumot (joylashuv) qurilmadan chiqmaydi.
 * WebP ni kodlay olmaydigan brauzer PNG qaytaradi: unda JPEG. Shaffof PNG PNG boʻlib qoladi.
 * Brauzer ocholmagan fayl (masalan eski Safari da AVIF) oʻzgarishsiz yuboriladi.
 */
export async function shrink(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file;
  }
  const scale = Math.min(1, LONG_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  if (file.type === "image/png") return (await canvasBlob(canvas, "image/png")) ?? file;
  const webp = await canvasBlob(canvas, "image/webp");
  if (webp?.type === "image/webp") return webp;
  return (await canvasBlob(canvas, "image/jpeg")) ?? file;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-biib-admin": "1" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new UploadFailure("network");
  }
  if (response.status === 401) throw new UploadFailure("denied");
  if (response.status === 422) throw new UploadFailure("unreadable");
  if (response.status === 413) throw new UploadFailure("size");
  if (!response.ok) throw new UploadFailure("server");
  return (await response.json()) as T;
}

/* XMLHttpRequest: fetch yuklash jarayonini (foizni) bermaydi. */
function put(url: string, blob: Blob, onProgress: (share: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new UploadFailure("server"));
    xhr.onerror = () => reject(new UploadFailure("network"));
    const form = new FormData();
    form.append("cacheControl", "3600");
    form.append("", blob);
    xhr.send(form);
  });
}

export type UploadPhase = "preparing" | "uploading" | "processing";

/** Bitta rasm: kichraytirish → imzoli manzil → toʻgʻridan-toʻgʻri yuklash → serverda nusxalar. */
export async function uploadImage(
  file: File,
  purpose: MediaPurpose,
  onPhase: (phase: UploadPhase, share: number) => void,
): Promise<MediaItem> {
  if (!isUploadType(file.type)) throw new UploadFailure("type");
  onPhase("preparing", 0);
  const blob = await shrink(file);
  const mime = blob.type || file.type;
  if (!isUploadType(mime)) throw new UploadFailure("type");
  if (blob.size > UPLOAD_MAX_BYTES) throw new UploadFailure("size");
  const { path, signedUrl } = await postJson<{ path: string; signedUrl: string }>(
    "/admin/api/media/sign",
    { purpose, mime, bytes: blob.size },
  );
  await put(signedUrl, blob, (share) => onPhase("uploading", share));
  onPhase("processing", 1);
  return postJson<MediaItem>("/admin/api/media/finalize", { path, purpose });
}

/** Bir vaqtda koʻpi bilan limit ta vazifa; natijalar kirish tartibida. */
export async function runLimited<T, R>(
  items: readonly T[],
  limit: number,
  task: (item: T, index: number) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let next = 0;
  async function worker(): Promise<void> {
    while (next < items.length) {
      const index = next++;
      try {
        results[index] = { status: "fulfilled", value: await task(items[index] as T, index) };
      } catch (reason) {
        results[index] = { status: "rejected", reason };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
