import Chat from '@/components/Chat.vue'
import vuetify from '@/plugins/vuetify'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

console.log('MojoChat embed script loaded') // Debug log

// Create global MojoChat object
window.MojoChat = {
  init: function(config) {
    console.log('MojoChat init called with config:', config) // Debug log
    
    // Create container for the chat widget
    const chatContainer = document.createElement('div')

    chatContainer.id = 'mojo-chat-widget'
    document.body.appendChild(chatContainer)

    // Create Vue app
    const app = createApp(Chat, {
      propertyId: config.propertyId,
    })

    // Use plugins
    const pinia = createPinia()

    app.use(pinia)
    app.use(vuetify)
    
    console.log('Mounting chat widget to:', chatContainer) // Debug log

    // Mount app
    app.mount('#mojo-chat-widget')
  },
}

// Make sure MojoChat is available globally
console.log('MojoChat object created:', window.MojoChat) // Debug log 
