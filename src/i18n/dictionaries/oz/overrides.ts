import type { DeepPartial, Dictionary } from "../types";

/** Transliteratordan keyingi qoʻlda tuzatishlar (proofreading). Kalit yoʻli uz/ bilan bir xil. */
export const overrides: DeepPartial<Dictionary> = {
  home: {
    portal: {
      // {{soʻz}} qavslari transliteratordan himoyalangan, chizilgan soʻzlar kirillda boʻlishi kerak.
      statement:
        "Ҳар бир бола ўз {{овозини}}, {{рангини}} ва {{саҳнасини}} топсин деб ишлаймиз. Вилоят студияларидан пойтахт концертигача битта йўл.",
    },
  },
};
