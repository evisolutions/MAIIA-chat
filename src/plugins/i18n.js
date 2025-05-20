import en from "@/locales/en.json";
import sr from "@/locales/sr.json";
import { createI18n } from "vue-i18n";

const messages = {
  en,
  sr,
};

export default function (locale = "en") {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: "en",
    messages,
  });
}
