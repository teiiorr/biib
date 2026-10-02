import { getMedia } from "@/content";

import { Picture, type PictureProps } from "./Picture";

/** Kontent nusxasida shu manba uchun tayyor nusxalar boʻlsa ular olinadi, aks holda manifestdan. */
export async function ContentPicture(props: PictureProps) {
  const media = await getMedia();
  return <Picture {...props} image={media[props.src]} />;
}
