import { renderRefractionPixels } from "./refraction-map";

export interface RefractionRequest {
  readonly id: number;
  readonly width: number;
  readonly height: number;
  readonly radius: number;
}

export interface RefractionResponse {
  readonly id: number;
  readonly blob: Blob | null;
}

interface WorkerScope {
  onmessage: ((event: MessageEvent<RefractionRequest>) => void) | null;
  postMessage(message: RefractionResponse): void;
}

/* Piksel sikli va PNG kodlash asosiy oqimdan tashqarida: gidratsiya paytida uzun vazifa boʻlmaydi. */
const scope = self as unknown as WorkerScope;
scope.onmessage = async (event) => {
  const { id, width, height, radius } = event.data;
  try {
    const pixels = renderRefractionPixels(width, height, radius);
    const canvas = new OffscreenCanvas(pixels.width, pixels.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      scope.postMessage({ id, blob: null });
      return;
    }
    ctx.putImageData(new ImageData(pixels.data, pixels.width, pixels.height), 0, 0);
    const blob = await canvas.convertToBlob({ type: "image/png" });
    scope.postMessage({ id, blob });
  } catch {
    scope.postMessage({ id, blob: null });
  }
};
