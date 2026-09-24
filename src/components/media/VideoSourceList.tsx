import type { VideoSources } from "@/content/types";

/* AV1 Main, 3.1 daraja (1280×720@24 shunga sigʻadi), 8 bit: media.mjs chiqishi bilan bir xil. */
const WEBM_TYPE = 'video/webm; codecs="av01.0.05M.08"';
const MP4_TYPE = "video/mp4";

/** WebM (AV1) birinchi, H.264 MP4 zaxira: AV1 ni bilmagan Safari ikkinchisiga oʻtadi. */
export function VideoSourceList({ sources }: { readonly sources: VideoSources }) {
  return (
    <>
      <source src={sources.webm} type={WEBM_TYPE} />
      <source src={sources.mp4} type={MP4_TYPE} />
    </>
  );
}
