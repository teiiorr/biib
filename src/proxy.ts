import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Kengaytmali fayllar çetda qoladi: sitemap.xml, robots.txt, og rasm.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
