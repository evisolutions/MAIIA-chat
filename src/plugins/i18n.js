import de from "@/locales/de.json";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import fr from "@/locales/fr.json";
import it from "@/locales/it.json";
import ru from "@/locales/ru.json";
import sr from "@/locales/sr.json";
import { createI18n } from "vue-i18n";

const messages = {
  en,
  sr,
  fr,
  it,
  de,
  es,
  ru,
};

export default function (locale = "en") {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: "en",
    messages,
  });
}
