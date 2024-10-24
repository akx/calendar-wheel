import { Locale } from "date-fns";
import { enUS as dateFnsEn, fi as dateFnsFi } from "date-fns/locale";
import { Palette } from "./palettes/types";
import claude from "./palettes/claude";
import spectral from "./palettes/spectral";

export const locales: Record<string, Locale> = {
  "en-US": dateFnsEn,
  fi: dateFnsFi,
};
export const palettes: Record<string, Palette> = {
  claude,
  spectral,
};
export const localeLabels = {
  "en-US": "English",
  fi: "Finnish",
};
