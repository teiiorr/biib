import { getMedia } from "@/content";

import { Picture, type PictureProps } from "./Picture";

/**
 * Kontent rasmi (yangilik, odam, hamkor, galereya): kontent nusxasida shu manba uchun tayyor nusxalar
 * boʻlsa ular ishlatiladi, aks holda oddiy Picture kabi manifestdan. Brend rasmlari Picture da qoladi.
 */
export async function ContentPicture(props: PictureProps) {
  const media = await getMedia();
  return <Picture {...props} image={media[props.src]} />;
}
