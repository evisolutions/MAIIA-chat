import createI18n from '@/plugins/i18n'
import App from "./App.vue"

const MaiiaWidget = {
  init(containerId, options = {}) {
    if (!window.Vue) throw new Error("Vue is not loaded")
    if (!window.Vuetify) throw new Error("Vuetify is not loaded")
    if (!window.Pinia) throw new Error("Pinia is not loaded")

    try {
      // Kreiramo Shadow DOM container
      const container = document.getElementById(containerId)
      const shadow = container.attachShadow({ mode: "open" })

      // Kreiramo mount point unutar Shadow DOM-a
      const mountPoint = document.createElement("div")

      shadow.appendChild(mountPoint)

      const app = window.Vue.createApp(App)

      // Kreiramo i dodamo Pinia
      const pinia = window.Pinia.createPinia()

      app.use(pinia)

      // Dodajemo globalne parametre
      app.provide("widgetConfig", {
        propertyId: options.propertyId,
        conversationType: options.conversationType,
        zIndex: options.zIndex,
      })

      // Kreiramo i dodamo Vuetify
      const vuetify = window.Vuetify.createVuetify({
        theme: {
          defaultTheme: options.theme || "light",
        },
      })

      app.use(vuetify)

      // Dodajemo i18n
      const i18n = createI18n(options.locale || 'en')

      app.use(i18n)

      // Mountamo app u Shadow DOM
      app.mount(mountPoint)

      // Dodajemo potrebne stilove u Shadow DOM
      const styles = document.createElement("style")

      styles.textContent = `
        @import url('https://cdn.jsdelivr.net/npm/vuetify@3.4.9/dist/vuetify.min.css');
        @import url('https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');


        /* Custom stilovi za widget */
        * {
          font-family: "Inter", sans-serif !important;
        }

        .chat-app-layout {
          box-shadow: 0 4px 10px rgba(46, 38, 61, 0.2) !important;
        }

        .chat-content-container {
          background-color: #fff !important;
        }

        .chat-message-input .v-field--appended {
          padding-inline-end: 6px !important;
          border-radius: 100px !important;
          background: #f0f2fa !important;
          box-shadow: none !important;
        }

        .chat-message-input .v-field--appended * {
          color: #1b202d !important;
        }

        .v-field__append-inner {
          cursor: pointer !important;
        }

        .chat-btn {
          cursor: pointer !important;
        }

        .bg-surface-custom {
          background-color: rgb(242, 244, 251) !important;
          color: rgb(71, 65, 85) !important;
        }

        .text-secondary-custom {
          color: rgb(137, 140, 145) !important;
        }

        .py-2-custom {
          padding-top: 8px !important;
          padding-bottom: 8px !important;
        }

        .chat-dot {
          height: 10px;
          width: 10px;
          background: #ccc;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 50%;
          animation: pulse 0.9s infinite;

          &:nth-child(2) {
            left: 14px;
            animation-delay: 0.3s;
          }

          &:nth-child(3) {
            left: 28px;
            animation-delay: 0.6s;
          }
        }

        @keyframes pulse {
          0% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 0.25;
          }
        }

        .chip-choice {
          color: rgba(121, 116, 126, 1) !important;
        }

        .chip-choice-selected {
          color: rgba(236, 241, 244, 1) !important;
          border-color: var(--v-theme-main) !important;
        }

        /* Fix za z-index */
        #app {
          z-index: 999999;
        }
      `
      shadow.appendChild(styles)

      console.log("Widget mounted successfully with config:", options)

      return {
        app,
        pinia,
        vuetify,
        i18n,
        unmount: () => app.unmount(),
      }
    } catch (error) {
      console.error("Widget initialization failed:", error)
      throw error
    }
  },
}

if (typeof window !== "undefined") {
  window.MaiiaWidget = MaiiaWidget
}

export default MaiiaWidget
