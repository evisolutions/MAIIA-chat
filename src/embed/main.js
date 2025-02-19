import Chat from '@/components/Chat.vue'
import vuetify from '@/plugins/vuetify'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

console.log('MojoChat embed script loaded') // Debug log

// Create global MojoChat object
window.MojoChat = {
  init: function(config) {
    console.log('MojoChat init called with config:', config) // Debug log
    
    // Create container for the chat
    const chatContainer = document.createElement('div')

    chatContainer.id = 'mojo-chat-container'
    document.body.appendChild(chatContainer)

    // Create Vue app
    const app = createApp({
      data() {
        return {
          propertyId: config.propertyId,
        }
      },
      template: '<Chat :property-id="propertyId" />',
    })

    // Use plugins
    const pinia = createPinia()

    app.use(pinia)
    app.use(vuetify)
    
    // Register Chat component
    app.component('Chat', Chat)

    console.log('Mounting app to:', chatContainer) // Debug log

    // Mount app
    app.mount('#mojo-chat-container')
  },
}

// Make sure MojoChat is available globally
console.log('MojoChat object created:', window.MojoChat) // Debug log 
