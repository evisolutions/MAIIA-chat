import App from './App.vue'

const MaiiaWidget = {
  init(containerId, options = {}) {
    if (!window.Vue) throw new Error('Vue is not loaded')
    if (!window.Vuetify) throw new Error('Vuetify is not loaded')
    if (!window.Pinia) throw new Error('Pinia is not loaded')

    try {
      const app = window.Vue.createApp(App)
      
      // Dodajemo Pinia
      const pinia = window.Pinia.createPinia()

      app.use(pinia)
      
      // Dodajemo Vuetify
      const vuetify = window.Vuetify.createVuetify({
        theme: {
          defaultTheme: options.theme || 'light',
        },
      })

      app.use(vuetify)
      
      app.mount(`#${containerId}`)
      console.log('Widget mounted successfully')

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
