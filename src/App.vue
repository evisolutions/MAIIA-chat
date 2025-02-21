<template>
  <VApp>
    <VMain>
      <VContainer>
        <VCard>
          <VCardTitle>
            <div
              v-if="chatStore.property?.addOnIconUrl"
              class="py-2"
            >
              <img
                :src="chatStore.property.addOnIconUrl"
                style="block-size: 50px"
              >
            </div>
          </VCardTitle>
          <VCardText>
            <div v-if="chatStore.activeChat">
              <div
                v-for="message in chatStore.activeChat.messages" 
                :key="message.messageId"
                class="mb-3"
              >
                <VAlert
                  :color="message.senderId === 1 ? 'primary' : 'grey-lighten-1'"
                  :variant="message.senderId === 1 ? 'tonal' : 'outlined'"
                >
                  {{ message.text }}
                </VAlert>
              </div>
            </div>

            <VForm
              class="mt-4"
              @submit.prevent="sendMessage"
            >
              <VTextField
                v-model="msg"
                placeholder="Type a message..."
                :loading="chatStore.loading"
                :disabled="chatStore.loading"
                append-inner-icon="mdi-send"
                @click:append-inner="sendMessage"
              />
            </VForm>
          </VCardText>
        </VCard>
      </VContainer>
    </VMain>
  </VApp>
</template>

<script setup>
import { useChatStore } from '@/views/apps/chat/useChatStore'
import { onMounted, ref } from 'vue'
import { useTheme } from 'vuetify'

const { global } = useTheme()
const chatStore = useChatStore()
const msg = ref("")

const sendMessage = async () => {
  if (!msg.value) return
  await chatStore.sendMsg(msg.value)
  msg.value = ""
}

onMounted(async () => {
  const PROPERTY_ID = import.meta.env.VITE_APP_PROPERTY_ID
  
  if (PROPERTY_ID) {
    await chatStore.fetchProperty(PROPERTY_ID)
  }
  
  chatStore.setInitialChat()
})
</script>
