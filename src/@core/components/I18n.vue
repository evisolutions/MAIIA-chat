<script setup>
import { onMounted } from "vue";
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

// Set locale from localStorage on mount
onMounted(() => {
  const storedLang = localStorage.getItem("locale");
  if (storedLang && storedLang !== locale.value) {
    locale.value = storedLang;
  }
});

// Function to handle language change and store in localStorage
function setLocale(lang) {
  locale.value = lang;
  localStorage.setItem("locale", lang);
}
</script>

<template>
  <IconBtn>
    <img
      :src="`https://flagsapi.com/${
        props.languages.find((lang) => lang.i18nLang === locale)?.icon
      }/flat/32.png`"
      width="24"
      height="24"
      class="d-flex ms-1"
      alt="Selected language flag"
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
          @click="setLocale(lang.i18nLang)"
          class="language-item"
        >
          <!-- Language label -->
          <VListItemIcon>
            <img
              :src="`https://flagsapi.com/${lang.icon}/flat/32.png`"
              width="24"
              height="24"
            />
          </VListItemIcon>
          <VListItemTitle>{{ lang.label }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </IconBtn>
</template>
