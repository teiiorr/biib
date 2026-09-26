/** Rasm qayerda ishlatiladi: nusxa kengliklari va xira fon shunga qarab. */
export const MEDIA_PURPOSES = ["cover", "photo", "portrait", "logo", "gallery", "poster"] as const;
export type MediaPurpose = (typeof MEDIA_PURPOSES)[number];

/* Kengliklar sahifadagi ramkalarga mos (images.mjs bilan bir xil oila); manbadan katta nusxa qilinmaydi. */
export const PURPOSE_WIDTHS: Readonly<Record<MediaPurpose, readonly number[]>> = {
  cover: [256, 384, 640, 960, 1344],
  photo: [400, 800, 1200],
  portrait: [320, 480, 640, 960],
  logo: [240, 480, 720],
  gallery: [400, 800, 1200],
  poster: [640, 1280],
};

/** Shaffof logotip qorongʻi plitkada turadi: xira fon unga kerak emas. */
export const PURPOSE_BLUR: Readonly<Record<MediaPurpose, boolean>> = {
  cover: true,
  photo: true,
  portrait: true,
  logo: false,
  gallery: true,
  poster: true,
};

/* HEIC roʻyxatda yoʻq: iPhone tanlangan suratni oʻzi JPEG ga aylantirib beradi. */
export const UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export type UploadType = (typeof UPLOAD_TYPES)[number];

export const UPLOAD_EXT: Readonly<Record<UploadType, string>> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/* originals bucket chegarasi bilan bir xil (26214400 bayt). */
export const UPLOAD_MAX_BYTES = 25 * 1024 * 1024;
