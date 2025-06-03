<template>
  <VApp>
    <VMain>
      <div
        class="d-flex flex-column align-end w-100 position-fixed"
        :style="widgetContainerStyle"
      >
        <VLayout
          v-if="showChat"
          class="chat-app-layout bg-surface d-flex flex-column justify-end align-end"
          :style="
            vuetifyDisplays.width.value < 480
              ? {
                  width: '100vw',
                  maxWidth: '100vw',
                  height: '100dvh',
                  maxHeight: '100dvh',
                  top: 0,
                  left: 0,
                  borderRadius: '0px',
                }
              : {
                  width: '90vw',
                  maxWidth: '505px',
                  height: '85vh',
                  maxHeight: '800px',
                  borderRadius: '16px 16px 20px 20px',
                }
          "
        >
          <!-- 👉 Chat content -->
          <VMain
            class="chat-content-container d-flex flex-column h-100"
            :style="
              vuetifyDisplays.width.value < 480
                ? { width: '100vw', height: '100dvh' }
                : {}
            "
          >
            <!-- 👉 Right content: Active Chat -->
            <div
              v-if="store.activeChat"
              class="d-flex flex-column h-100"
              style="flex-grow: 1"
            >
              <!-- 👉 Active chat header -->
              <div
                class="active-chat-header d-flex align-center px-4 py-3"
                style="
                  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 6%),
                    0 4px 6px -1px rgba(0, 0, 0, 10%);
                "
              >
                <div class="d-flex align-center" style="flex: 1 1 0%">
                  <img
                    :src="store.property.addOnIconUrl"
                    style="aspect-ratio: 1; block-size: 44px"
                  />
                  <div
                    class="d-flex flex-column align-start justify-center ml-4"
                  >
                    <h3
                      class="heading-3 text-dark-gray"
                      style="color: rgba(27, 32, 45, 100%)"
                    >
                      {{ store.property.botName }}
                    </h3>
                    <p
                      class="text-body-2 text-gray-50"
                      style="color: rgba(27, 32, 45, 50%)"
                    >
                      {{ $t("AI interactive assistant") }}
                    </p>
                  </div>

                  <div class="d-flex align-center justify-center ml-auto">
                    <I18n :languages="languages" />
                  </div>

                  <span
                    v-if="vuetifyDisplays.width.value < 480"
                    class="text-body-2 text-gray-50 cursor-pointer ml-4 align-self-start"
                    style="color: rgba(27, 32, 45, 50%)"
                    @click="showChat = false"
                    >&#10006;</span
                  >
                </div>
              </div>

              <!-- Chat log -->
              <ul
                ref="chatLogPS"
                class="flex-grow-1 my-1"
                style="
                  block-size: auto;
                  -ms-overflow-style: none; /* IE and Edge */
                  overflow-y: auto;
                  scroll-behavior: smooth;
                  scrollbar-width: none; /* Firefox */
                "
              >
                <ChatLog @send-message="handleSendMessageFromChoice" />
              </ul>

              <!-- Message form -->
              <VForm
                class="chat-log-message-form d-flex align-center justify-center mx-5 my-3"
                @submit.prevent="sendMessage"
              >
                <VTextField
                  v-model="msg"
                  variant="solo"
                  density="compact"
                  class="chat-message-input"
                  :placeholder="$t('Message') + '...'"
                  :disabled="store.loading"
                  autocomplete="off"
                  hide-details
                  :style="chatTextFieldStyle"
                >
                  <template #prepend-inner>
                    <p
                      width="20"
                      height="20"
                      class="d-flex ms-1"
                      @click="sendMessage"
                      v-html="LightbulbIcon"
                    />
                  </template>
                  <template #append-inner>
                    <p
                      width="20"
                      height="20"
                      class="d-flex cursor-pointer me-2"
                      @click="sendMessage"
                      v-html="SendIcon"
                    />
                  </template>
                </VTextField>
              </VForm>
            </div>
          </VMain>
        </VLayout>
        <VImg
          v-if="!(vuetifyDisplays.width.value < 480 && showChat)"
          :src="store.property?.botIconUrl"
          class="rounded-circle chat-btn"
          :style="botIconStyle"
          @click="() => (showChat = !showChat)"
        />
      </div>
    </VMain>
  </VApp>
</template>

<script setup>
import ChatLog from "@/views/apps/chat/ChatLog.vue";
import { useChatStore } from "@/views/apps/chat/useChatStore";
import LightbulbIcon from "@images/svg/lightbulb-icon.svg?raw";
import SendIcon from "@images/svg/send-icon.svg?raw";
import "@styles/styles.scss";
import { computed, inject, nextTick, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay, useTheme } from "vuetify";
import I18n from "./@core/components/I18n.vue";

const languages = [
  { i18nLang: "en", label: "English", icon: "GB" },
  { i18nLang: "sr", label: "Srpski", icon: "RS" },
  { i18nLang: "fr", label: "Français", icon: "FR" },
  { i18nLang: "it", label: "Italiano", icon: "IT" },
  { i18nLang: "de", label: "Deutsch", icon: "DE" },
  { i18nLang: "es", label: "Español", icon: "ES" },
  { i18nLang: "ru", label: "Русский", icon: "RU" },
];

const { locale } = useI18n({ useScope: "global" });

// Get widget configuration from injection
const widgetConfig = inject("widgetConfig", {});

// Get options from widget initialization if available
const options = window.MAIIAWidgetOptions || {};
const widgetZIndex = ref(widgetConfig.zIndex || options.zIndex || 9999);

const { global } = useTheme();
const chatStore = useChatStore();

onMounted(async () => {
  // Use propertyId from widget configuration instead of environment variable
  const propertyId = widgetConfig.propertyId;

  if (propertyId) {
    await chatStore.fetchProperty(propertyId);
  }

  chatStore.setInitialChat();
});

import { themes } from "@/plugins/vuetify/theme";

// composables
const vuetifyDisplays = useDisplay();
const store = useChatStore();

// Perfect scrollbar
const chatLogPS = ref();

const scrollToBottomInChatLog = () => {
  if (!chatLogPS.value) return;

  const scrollEl = chatLogPS.value.$el || chatLogPS.value;

  scrollEl.scrollTop = scrollEl.scrollHeight;
};

const showChat = ref(false);
const isLoading = ref(false);

// Chat message
const msg = ref("");

const sendMessage = async () => {
  if (!msg.value) return;

  const sendMessageAndScroll = async () => {
    setTimeout(() => {
      scrollToBottomInChatLog();
    }, 100);
    await store.sendMsg(msg.value);
  };

  await sendMessageAndScroll();
  scrollToBottomInChatLog();

  // Reset message input
  msg.value = "";
};

// file input
const refInputEl = ref();

const { name } = useTheme();

const chatContentContainerBg = computed(() => {
  let color = "transparent";
  if (themes) color = themes?.[name.value].colors?.["chat-bg"];

  return color;
});

const handleSendMessageFromChoice = async (message) => {
  const sendMessageAndScroll = async () => {
    setTimeout(() => {
      scrollToBottomInChatLog();
    }, 100);
    await store.sendMsg(message);
  };

  await sendMessageAndScroll();
  scrollToBottomInChatLog();
};

onMounted(() => {
  store.getChat();
});

watch(
  () => store.activeChat,
  () => {
    nextTick(() => {
      scrollToBottomInChatLog();
    });
  }
);

watch(
  () => showChat.value,
  (val) => {
    if (val) {
      nextTick(() => {
        scrollToBottomInChatLog();
      });
    }
  }
);

// Responsive widget style
const widgetContainerStyle = computed(() => {
  if (vuetifyDisplays.width.value < 480) {
    return {
      right: "0px",
      bottom: "0px",
      left: "0px",
      top: "0px",
      width: "100vw",
      height: "100dvh",
      zIndex: widgetZIndex.value,
    };
  }

  return {
    right: "20px",
    bottom: "90px",
    zIndex: widgetZIndex.value,
    width: "0px !important",
  };
});

// Style for the activation bot icon (VImg)
const botIconStyle = computed(() => ({
  position: "fixed",
  right: "20px",
  bottom: "20px",
  width: "60px",
  height: "60px",
  zIndex: widgetZIndex.value,
}));

// Style for the chat message input (VTextField)
const chatTextFieldStyle = computed(() => ({
  // boxShadow: "none",
  // backgroundColor: "#f0f2fa",
}));
</script>

<style lang="scss">
.v-field__append-inner {
  cursor: pointer !important;
}
</style>
