<template>
  <VApp>
    <VMain>
      <div
        class="d-flex flex-column align-end w-100 position-fixed"
        :style="{ right: '20px', bottom: '20px', zIndex: widgetZIndex }"
      >
        <VLayout
          v-if="showChat"
          class="chat-app-layout bg-surface d-flex flex-column justify-end"
          style="width: 505px; height: 630px"
        >
          <!-- 👉 Chat content -->
          <VMain class="chat-content-container d-flex flex-column">
            <!-- 👉 Right content: Active Chat -->
            <div
              v-if="store.activeChat"
              class="d-flex flex-column h-100"
              style="flex-grow: 1"
            >
              <!-- 👉 Active chat header -->
              <div class="active-chat-header d-flex align-center text-medium-emphasis">
                <div
                  class="py-2-custom"
                  style="height: 60px"
                >
                  <img
                    :src="store.property.addOnIconUrl"
                    style="height: 50px"
                  >
                </div>
              </div>

              <VDivider />

              <!-- Chat log -->
              <PerfectScrollbar
                ref="chatLogPS"
                tag="ul"
                class="flex-grow-1"
              >
                <ChatLog @send-message="handleSendMessageFromChoice" />
              </PerfectScrollbar>

              <!-- Message form -->
              <VForm
                class="chat-log-message-form mb-5 mx-5"
                @submit.prevent="sendMessage"
              >
                <VTextField
                  v-model="msg"
                  variant="solo"
                  density="default"
                  class="chat-message-input"
                  placeholder="Message..."
                  autofocus
                  :disabled="store.loading"
                  :loading="store.loading"
                  autocomplete="off"
                >
                  <template #append-inner>
                    <VImg
                      :src="SendIcon"
                      width="24"
                      height="24"
                      class="me-4"
                      @click="sendMessage"
                    />
                  </template>
                </VTextField>
              </VForm>
            </div>
          </VMain>
        </VLayout>
        <VImg
          :src="store.property.botIconUrl"
          class="rounded-circle mt-2 justify-self-end chat-btn"
          style=" width: 60px;height: 60px"
          @click="() => (showChat = !showChat)"
        />
      </div>
    </VMain>
  </VApp>
</template>

<script setup>
import { useChatStore } from "@/views/apps/chat/useChatStore"
import SendIcon from "@images/icons/send-icon.webp"
import "@styles/styles.scss"
import { computed, nextTick, onMounted, ref, watch } from "vue"
import { useDisplay, useTheme } from "vuetify"

// Get options from widget initialization if available
const options = window.MAIIAWidgetOptions || {}
const widgetZIndex = ref(options.zIndex || 9999)

const { global } = useTheme()
const chatStore = useChatStore()

onMounted(async () => {
  const PROPERTY_ID = import.meta.env.VITE_APP_PROPERTY_ID

  if (PROPERTY_ID) {
    await chatStore.fetchProperty(PROPERTY_ID)
  }

  chatStore.setInitialChat()
})

import { themes } from "@/plugins/vuetify/theme"
import ChatLog from "@/views/apps/chat/ChatLog.vue"
import { PerfectScrollbar } from "vue3-perfect-scrollbar"


// composables
const vuetifyDisplays = useDisplay()
const store = useChatStore()

// Perfect scrollbar
const chatLogPS = ref()

const scrollToBottomInChatLog = () => {
  if (!chatLogPS.value) return

  const scrollEl = chatLogPS.value.$el || chatLogPS.value

  scrollEl.scrollTop = scrollEl.scrollHeight
}

const showChat = ref(false)
const isLoading = ref(false)

// Chat message
const msg = ref("")

const sendMessage = async () => {
  if (!msg.value) return

  await store.sendMsg(msg.value)

  // Reset message input
  msg.value = ""

  // Scroll to bottom
  nextTick(() => {
    scrollToBottomInChatLog()
  })
}

// file input
const refInputEl = ref()

const { name } = useTheme()

const chatContentContainerBg = computed(() => {
  let color = "transparent"
  if (themes) color = themes?.[name.value].colors?.["chat-bg"]

  return color
})

const handleSendMessageFromChoice = async message => {
  await store.sendMsg(message)

  nextTick(() => {
    scrollToBottomInChatLog()
  })
}

onMounted(() => {
  store.getChat()
})

watch(
  () => store.activeChat,
  () => {
    nextTick(() => {
      scrollToBottomInChatLog()
    })
  },
)

watch(
  () => showChat.value,
  val => {
    if (val) {
      nextTick(() => {
        scrollToBottomInChatLog()
      })
    }
  },
)
</script>

<style lang="scss">
@use "@styles/variables/vuetify.scss";
@use "@core/scss/base/mixins.scss";
@use "@layouts/styles/mixins" as layoutsMixins;

// Variables
$chat-app-header-height: 76px;

%chat-header {
  // Define your shared header styles here
  // This was missing but referenced with @extend
}

.chat-app-layout {
  @include mixins.elevation(vuetify.$card-elevation);

  $sel-chat-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-chat-app-layout);
    }
  }

  .active-chat-user-profile-sidebar,
  .user-profile-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }

  .chat-list-header,
  .active-chat-header {
    @extend %chat-header;
  }

  .chat-list-search {
    .v-field__outline__start {
      flex-basis: 20px !important;
      border-radius: 28px 0 0 28px !important;
    }

    .v-field__outline__end {
      border-radius: 0 28px 28px 0 !important;
    }

    @include layoutsMixins.rtl {
      .v-field__outline__start {
        flex-basis: 20px !important;
        border-radius: 0 28px 28px 0 !important;
      }

      .v-field__outline__end {
        border-radius: 28px 0 0 28px !important;
      }
    }
  }

  .chat-list-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }
}

.chat-content-container {
  /* stylelint-disable-next-line value-keyword-case */
  background-color: #fff;

  // Adjust the padding so text field height stays 48px
  .chat-message-input {
    .v-input__control {
    }

    .v-field__append-inner {
      align-items: center;
      padding-block-start: 0;
    }

    .v-field--appended {
      border-radius: 100px;
      background: #f2f4fb !important;
      padding-inline-end: 6px;

      * {
        color: #1b202d;
      }
    }

    .v-field__input {
      padding-left: 24px;
    }
  }
}

.chat-user-profile-badge {
  .v-badge__badge {
    /* stylelint-disable liberty/use-logical-spec */
    min-width: 12px !important;
    height: 0.75rem;
    /* stylelint-enable liberty/use-logical-spec */
  }
}

// Custom styles
.chat-btn {
  cursor: pointer;
}

.bg-surface-custom {
  background-color: rgb(242, 244, 251) !important;
  color: rgb(71, 65, 85) !important;
}

.gap-2 {
  gap: 8px !important;
}

.text-secondary-custom {
  color: rgb(137, 140, 145) !important;
}

.chat-app-layout {
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(46, 38, 61, 20%), 0 0 transparent, 0 0 transparent;
}

.bg-transparent {
  background-color: transparent !important;
}

.py-2-custom {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}
</style>
