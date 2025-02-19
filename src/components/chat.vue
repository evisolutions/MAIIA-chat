<script setup>
import { themes } from "@/plugins/vuetify/theme"
import ChatLog from "@/views/apps/chat/ChatLog.vue"
import { useChatStore } from "@/views/apps/chat/useChatStore"
import SuncicaLogo from "@images/suncica-logo.png"
import { PerfectScrollbar } from "vue3-perfect-scrollbar"
import { useDisplay, useTheme } from "vuetify"

const props = defineProps({
  propertyId: {
    type: Number,
    required: true,
  },
})

definePage({ meta: { layoutWrapperClasses: "layout-content-height-fixed" } })

// composables
const vuetifyDisplays = useDisplay()
const store = useChatStore()

const { isLeftSidebarOpen } = useResponsiveLeftSidebar(
  vuetifyDisplays.smAndDown,
)

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

  isLoading.value = true

  await store.sendMsg(msg.value)

  isLoading.value = false

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

// Make propertyId available to your store or API calls
provide('propertyId', props.propertyId)
</script>

<template>
  <div
    class="d-flex flex-column align-end w-100 position-fixed"
    style=" right: 20px;bottom: 20px"
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
              class="py-2"
              style="height: 60px"
            >
              <img
                :src="SuncicaLogo"
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
                <VIcon
                  icon="ri-send-plane-2-line"
                  class="me-4"
                  @click="sendMessage"
                />
              </template>
            </VTextField>
          </VForm>
        </div>
      </VMain>
    </VLayout>
    <VBtn
      class="rounded-circle mt-2 justify-self-end"
      style=" width: 60px;height: 60px"
      @click="() => (showChat = !showChat)"
    >
      <VIcon
        icon="ri-chat-1-line"
        size="30"
      />
    </VBtn>
  </div>
</template>

<style lang="scss">
@use "@styles/variables/vuetify.scss";
@use "@core/scss/base/mixins.scss";
@use "@layouts/styles/mixins" as layoutsMixins;

// Variables
$chat-app-header-height: 76px;

// Placeholders
%chat-header {
  display: flex;
  align-items: center;
  min-block-size: $chat-app-header-height;
  padding-inline: 1.25rem;
}

.chat-app-layout {
  border-radius: vuetify.$card-border-radius;

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
</style>
