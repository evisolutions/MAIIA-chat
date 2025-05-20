<script setup>
import TranslateIcon from "@images/svg/translate-2.svg?raw";
import { useI18n } from "vue-i18n";

const props = defineProps({
  languages: {
    type: Array,
    required: true,
  },
  location: {
    type: null,
    required: false,
    default: "bottom end",
  },
});

const { locale } = useI18n({ useScope: "global" });
</script>

<template>
  <IconBtn>
    <p
      width="20"
      height="20"
      class="d-flex ms-1"
      @click="sendMessage"
      v-html="TranslateIcon"
    />

    <!-- Menu -->
    <VMenu
      activator="parent"
      :location="props.location"
      offset="15px"
      width="160"
    >
      <!-- List -->
      <VList :selected="[locale]" color="primary" mandatory>
        <!-- List item -->
        <VListItem
          v-for="lang in props.languages"
          :key="lang.i18nLang"
          :value="lang.i18nLang"
          @click="locale = lang.i18nLang"
        >
          <!-- Language label -->
          <VListItemTitle>{{ lang.label }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </IconBtn>
</template>
