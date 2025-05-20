import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    welcome: 'Welcome to MAIIA Chat!',
    send: 'Send',
    placeholder: 'Type your message...',
  },
  sr: {
    welcome: 'Dobrodošli u MAIIA Čet!',
    send: 'Pošalji',
    placeholder: 'Unesite vašu poruku...',
  },
}

export default function (locale = 'en') {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages,
  })
} 
