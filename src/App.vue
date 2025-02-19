<script setup>
import { useChatStore } from "@/views/apps/chat/useChatStore";
import initCore from "@core/initCore";
import { initConfigStore, useConfigStore } from "@core/stores/config";
import { hexToRgb } from "@layouts/utils";
import { useTheme } from "vuetify";

const { global } = useTheme();

// ℹ️ Sync current theme with initial loader theme
initCore();
initConfigStore();

const configStore = useConfigStore();

const chatStore = useChatStore();

onMounted(async () => {
  const PROPERTY_ID = import.meta.env.VITE_APP_PROPERTY_ID;

  await chatStore.fetchProperty(PROPERTY_ID);

  chatStore.setInitialChat();
});
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp
      :style="`--v-global-theme-primary: ${hexToRgb(
        global.current.value.colors.primary
      )}`"
    >
      <RouterView />
    </VApp>
  </VLocaleProvider>
</template>
