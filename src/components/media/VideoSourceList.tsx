import type { VideoSources } from "@/content/types";

/* media.mjs chiqaradigan fayl bilan bir xil: AV1 Main, 3.1 daraja, 8 bit (1280×720@24 shunga sigʻadi). */
const WEBM_TYPE = 'video/webm; codecs="av01.0.05M.08"';
const MP4_TYPE = "video/mp4";

/** AV1 ni bilmaydigan Safari WebM manbasini oʻtkazib, H.264 MP4 zaxirasini oladi. */
export function VideoSourceList({ sources }: { readonly sources: VideoSources }) {
  return (
    <>
      <source src={sources.webm} type={WEBM_TYPE} />
      <source src={sources.mp4} type={MP4_TYPE} />
    </>
  );
}
