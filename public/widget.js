// Usage script for other websites
const initChatWidget = (config = {}) => {
  // Create and append the web component
  const chatWidget = document.createElement('chat-widget')
  
  // Set any configuration attributes
  if (config.width) chatWidget.setAttribute('widget-width', config.width)
  if (config.height) chatWidget.setAttribute('widget-height', config.height)
  
  // Add to page
  document.body.appendChild(chatWidget)
  
  // Return control methods
  return {
    toggle: show => {
      const event = new CustomEvent('toggle-chat', { 
        detail: { show },
        bubbles: true,
        composed: true, 
      })

      document.dispatchEvent(event)
    },
    
    onMessage: callback => {
      document.addEventListener('message-sent', event => {
        callback(event.detail)
      })
    },
  }
} 
