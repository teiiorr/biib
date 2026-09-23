export interface Viewport {
  readonly width: number;
  readonly height: number;
}

/** §16.1 matritsasi: telefon oʻlchamlari mobil profillarda, kattalari desktop profillarda. */
export const PHONE_VIEWPORTS: readonly Viewport[] = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 393, height: 852 },
  { width: 412, height: 915 },
  { width: 414, height: 896 },
  { width: 430, height: 932 },
  { width: 844, height: 390 },
  { width: 932, height: 430 },
];

export const LARGE_VIEWPORTS: readonly Viewport[] = [
  { width: 600, height: 900 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 1366 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
];

export const FIREFOX_VIEWPORTS: readonly Viewport[] = [
  { width: 390, height: 844 },
  { width: 1024, height: 1366 },
  { width: 1440, height: 900 },
];

/** G8 va aloqa varaqlari uchun uchta kenglik. */
export const VISUAL_VIEWPORTS: readonly Viewport[] = [
  { width: 390, height: 844 },
  { width: 820, height: 1180 },
  { width: 1440, height: 900 },
];

export function viewportsFor(browserName: string, isMobile: boolean): readonly Viewport[] {
  if (browserName === "firefox") return FIREFOX_VIEWPORTS;
  return isMobile ? PHONE_VIEWPORTS : LARGE_VIEWPORTS;
}

export function viewportLabel(viewport: Viewport): string {
  return `${viewport.width}x${viewport.height}`;
}
