import { createI18n } from "vue-i18n";

// Import all locale files
const messages = Object.fromEntries(
  Object.entries(import.meta.glob("./locales/*.json", { eager: true })).map(
    ([key, value]) => [key.slice(10, -5), value.default]
  )
);

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: "en", // Default locale
  fallbackLocale: "en",
  messages,
});

export default i18n;
