/**
 * Element hali ScrollTrigger boshlanish chizigʻidan (sukut «top 85%») pastdami. Dvigatel kech kelganda
 * ekranda turgan blok yashirilib qayta koʻrsatilmasligi uchun.
 */
export function belowViewport(element: Element, fraction = 0.85): boolean {
  return element.getBoundingClientRect().top >= window.innerHeight * fraction;
}

/** Sahna allaqachon koʻrinishga yetganmi: kech mahkamlansa sahifa sakraydi. */
export function reached(element: Element): boolean {
  return element.getBoundingClientRect().top < window.innerHeight;
}
