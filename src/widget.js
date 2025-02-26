import App from './App.vue'

const MaiiaWidget = {
  init(containerId, options = {}) {
    if (!window.Vue) throw new Error('Vue is not loaded')
    if (!window.Vuetify) throw new Error('Vuetify is not loaded')
    if (!window.Pinia) throw new Error('Pinia is not loaded')

    try {
      // Kreiramo Shadow DOM container
      const container = document.getElementById(containerId)
      const shadow = container.attachShadow({ mode: 'open' })
      
      // Kreiramo mount point unutar Shadow DOM-a
      const mountPoint = document.createElement('div')

      shadow.appendChild(mountPoint)

      const app = window.Vue.createApp(App)
      
      // Kreiramo i dodamo Pinia
      const pinia = window.Pinia.createPinia()

      app.use(pinia)
      
      // Dodajemo globalne parametre
      app.provide('widgetConfig', {
        propertyId: options.propertyId,
        conversationType: options.conversationType,
      })
      
      // Kreiramo i dodamo Vuetify
      const vuetify = window.Vuetify.createVuetify({
        theme: {
          defaultTheme: options.theme || 'light',
        },
      })

      app.use(vuetify)
      
      // Mountamo app u Shadow DOM
      app.mount(mountPoint)
      
      // Dodajemo potrebne stilove u Shadow DOM
      const styles = document.createElement('style')

      styles.textContent = `
        @import url('https://cdn.jsdelivr.net/npm/vuetify@3.4.9/dist/vuetify.min.css');
        @import url('https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css');
        
        /* Custom stilovi za widget */
        .chat-app-layout {
          border-radius: 6px !important;
          box-shadow: 0 4px 10px rgba(46, 38, 61, 0.2) !important;
        }

        .chat-content-container {
          background-color: #fff !important;
        }

        .chat-message-input .v-field--appended {
          padding-inline-end: 6px !important;
          border-radius: 100px !important;
          background: #f2f4fb !important;
        }

        .chat-message-input .v-field--appended * {
          color: #1b202d !important;
        }

        .chat-message-input .v-field__input {
          padding-left: 24px !important;
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

        /* Vuetify overrides */
        .v-application {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        /* Fix za z-index */
        #app {
          position: relative;
          z-index: 999999;
        }
      `
      shadow.appendChild(styles)

      console.log('Widget mounted successfully with config:', options)

      return {
        app,
        pinia,
        vuetify,
        unmount: () => app.unmount(),
      }
    } catch (error) {
      console.error('Widget initialization failed:', error)
      throw error
    }
  },
}

if (typeof window !== 'undefined') {
  window.MaiiaWidget = MaiiaWidget
}

export default MaiiaWidget
