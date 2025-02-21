import App from './App.vue'

const MaiiaWidget = {
  init(containerId, options = {}) {
    if (!window.Vue) throw new Error('Vue is not loaded')
    if (!window.VueDemi) throw new Error('VueDemi is not loaded')
    if (!window.Pinia) throw new Error('Pinia is not loaded')
    if (!window.Vuetify) throw new Error('Vuetify is not loaded')

    // Kreiramo app koristeći globalni Vue
    const app = window.Vue.createApp(App)
    
    // Kreiramo i dodamo Pinia
    const pinia = window.Pinia.createPinia()

    app.use(pinia)
    
    // Kreiramo i dodamo Vuetify
    const vuetify = window.Vuetify.createVuetify({
      theme: {
        defaultTheme: options.theme || 'light',
      },
    })

    app.use(vuetify)
    
    // Mountamo
    app.mount(`#${containerId}`)
    
    return {
      app,
      pinia,
      vuetify,
      unmount: () => app.unmount(),
    }
  },
}

// Globalna registracija
if (typeof window !== 'undefined') {
  window.MaiiaWidget = MaiiaWidget
}

export default MaiiaWidget 
