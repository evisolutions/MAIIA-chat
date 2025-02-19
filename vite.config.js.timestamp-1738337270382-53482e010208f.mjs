// vite.config.js
import vue from "file:///C:/Users/EVI-01/Desktop/MAIIA/node_modules/.pnpm/@vitejs+plugin-vue@5.0.2_vite@5.0.10_vue@3.4.3/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/EVI-01/Desktop/MAIIA/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.0.10_vue@3.4.3/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { fileURLToPath } from "node:url";
import AutoImport from "file:///C:/Users/EVI-01/Desktop/MAIIA/node_modules/.pnpm/unplugin-auto-import@0.17.3_@vueuse+core@10.7.1/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/EVI-01/Desktop/MAIIA/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.3/node_modules/unplugin-vue-components/dist/vite.js";
import {
  VueRouterAutoImports,
  getPascalCaseRouteName
} from "file:///C:/Users/EVI-01/Desktop/MAIIA/node_modules/.pnpm/unplugin-vue-router@0.7.0_vue-router@4.2.5_vue@3.4.3/node_modules/unplugin-vue-router/dist/index.mjs";
import VueRouter from "file:///C:/Users/EVI-01/Desktop/MAIIA/node_modules/.pnpm/unplugin-vue-router@0.7.0_vue-router@4.2.5_vue@3.4.3/node_modules/unplugin-vue-router/dist/vite.mjs";
import { defineConfig } from "file:///C:/Users/EVI-01/Desktop/MAIIA/node_modules/.pnpm/vite@5.0.10_sass@1.69.6/node_modules/vite/dist/node/index.js";
import Layouts from "file:///C:/Users/EVI-01/Desktop/MAIIA/node_modules/.pnpm/vite-plugin-vue-layouts@0.10.0_vite@5.0.10_vue-router@4.2.5_vue@3.4.3/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import vuetify from "file:///C:/Users/EVI-01/Desktop/MAIIA/node_modules/.pnpm/vite-plugin-vuetify@2.0.1_vite@5.0.10_vue@3.4.3_vuetify@3.4.4/node_modules/vite-plugin-vuetify/dist/index.mjs";
import svgLoader from "file:///C:/Users/EVI-01/Desktop/MAIIA/node_modules/.pnpm/vite-svg-loader@5.1.0_vue@3.4.3/node_modules/vite-svg-loader/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/EVI-01/Desktop/MAIIA/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    // Docs: https://github.com/posva/unplugin-vue-router
    // ℹ️ This plugin should be placed before vue plugin
    VueRouter({
      getRouteName: (routeNode) => {
        return getPascalCaseRouteName(routeNode).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      }
    }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === "swiper-container" || tag === "swiper-slide"
        }
      }
    }),
    // VueDevTools(),
    vueJsx(),
    // Docs: https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
    vuetify({
      styles: {
        configFile: "src/assets/styles/variables/_vuetify.scss"
      }
    }),
    // Docs: https://github.com/johncampionjr/vite-plugin-vue-layouts#vite-plugin-vue-layouts
    Layouts({
      layoutsDirs: "./src/layouts/"
    }),
    // Docs: https://github.com/antfu/unplugin-vue-components#unplugin-vue-components
    Components({
      dirs: ["src/@core/components", "src/views/demos", "src/components"],
      dts: true,
      resolvers: [
        (componentName) => {
          if (componentName === "VueApexCharts")
            return {
              name: "default",
              from: "vue3-apexcharts",
              as: "VueApexCharts"
            };
        }
      ]
    }),
    // Docs: https://github.com/antfu/unplugin-auto-import#unplugin-auto-import
    AutoImport({
      imports: [
        "vue",
        VueRouterAutoImports,
        "@vueuse/core",
        "@vueuse/math",
        "vue-i18n",
        "pinia"
      ],
      dirs: [
        "./src/@core/utils",
        "./src/@core/composable/",
        "./src/composables/",
        "./src/utils/",
        "./src/plugins/*/composables/*"
      ],
      vueTemplate: true,
      // ℹ️ Disabled to avoid confusion & accidental usage
      ignore: ["useCookies", "useStorage"],
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json"
      }
    }),
    svgLoader()
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "@themeConfig": fileURLToPath(
        new URL("./themeConfig.js", __vite_injected_original_import_meta_url)
      ),
      "@core": fileURLToPath(new URL("./src/@core", __vite_injected_original_import_meta_url)),
      "@layouts": fileURLToPath(new URL("./src/@layouts", __vite_injected_original_import_meta_url)),
      "@images": fileURLToPath(
        new URL("./src/assets/images/", __vite_injected_original_import_meta_url)
      ),
      "@styles": fileURLToPath(
        new URL("./src/assets/styles/", __vite_injected_original_import_meta_url)
      ),
      "@configured-variables": fileURLToPath(
        new URL("./src/assets/styles/variables/_template.scss", __vite_injected_original_import_meta_url)
      ),
      "@db": fileURLToPath(
        new URL("./src/plugins/fake-api/handlers/", __vite_injected_original_import_meta_url)
      ),
      "@api-utils": fileURLToPath(
        new URL("./src/plugins/fake-api/utils/", __vite_injected_original_import_meta_url)
      )
    }
  },
  build: {
    chunkSizeWarningLimit: 5e3
  },
  optimizeDeps: {
    exclude: ["vuetify"],
    entries: ["./src/**/*.vue"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxFVkktMDFcXFxcRGVza3RvcFxcXFxNQUlJQVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcRVZJLTAxXFxcXERlc2t0b3BcXFxcTUFJSUFcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0VWSS0wMS9EZXNrdG9wL01BSUlBL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcIm5vZGU6dXJsXCI7XG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcbmltcG9ydCB7XG4gIFZ1ZVJvdXRlckF1dG9JbXBvcnRzLFxuICBnZXRQYXNjYWxDYXNlUm91dGVOYW1lLFxufSBmcm9tIFwidW5wbHVnaW4tdnVlLXJvdXRlclwiO1xuaW1wb3J0IFZ1ZVJvdXRlciBmcm9tIFwidW5wbHVnaW4tdnVlLXJvdXRlci92aXRlXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IExheW91dHMgZnJvbSBcInZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzXCI7XG5pbXBvcnQgdnVldGlmeSBmcm9tIFwidml0ZS1wbHVnaW4tdnVldGlmeVwiO1xuaW1wb3J0IHN2Z0xvYWRlciBmcm9tIFwidml0ZS1zdmctbG9hZGVyXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgLy8gRG9jczogaHR0cHM6Ly9naXRodWIuY29tL3Bvc3ZhL3VucGx1Z2luLXZ1ZS1yb3V0ZXJcbiAgICAvLyBcdTIxMzlcdUZFMEYgVGhpcyBwbHVnaW4gc2hvdWxkIGJlIHBsYWNlZCBiZWZvcmUgdnVlIHBsdWdpblxuICAgIFZ1ZVJvdXRlcih7XG4gICAgICBnZXRSb3V0ZU5hbWU6IChyb3V0ZU5vZGUpID0+IHtcbiAgICAgICAgLy8gQ29udmVydCBwYXNjYWwgY2FzZSB0byBrZWJhYiBjYXNlXG4gICAgICAgIHJldHVybiBnZXRQYXNjYWxDYXNlUm91dGVOYW1lKHJvdXRlTm9kZSlcbiAgICAgICAgICAucmVwbGFjZSgvKFthLXowLTldKShbQS1aXSkvZywgXCIkMS0kMlwiKVxuICAgICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSxcbiAgICB9KSxcbiAgICB2dWUoe1xuICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgICAgaXNDdXN0b21FbGVtZW50OiAodGFnKSA9PlxuICAgICAgICAgICAgdGFnID09PSBcInN3aXBlci1jb250YWluZXJcIiB8fCB0YWcgPT09IFwic3dpcGVyLXNsaWRlXCIsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pLFxuICAgIC8vIFZ1ZURldlRvb2xzKCksXG4gICAgdnVlSnN4KCksXG5cbiAgICAvLyBEb2NzOiBodHRwczovL2dpdGh1Yi5jb20vdnVldGlmeWpzL3Z1ZXRpZnktbG9hZGVyL3RyZWUvbWFzdGVyL3BhY2thZ2VzL3ZpdGUtcGx1Z2luXG4gICAgdnVldGlmeSh7XG4gICAgICBzdHlsZXM6IHtcbiAgICAgICAgY29uZmlnRmlsZTogXCJzcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMvX3Z1ZXRpZnkuc2Nzc1wiLFxuICAgICAgfSxcbiAgICB9KSxcblxuICAgIC8vIERvY3M6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb2huY2FtcGlvbmpyL3ZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzI3ZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzXG4gICAgTGF5b3V0cyh7XG4gICAgICBsYXlvdXRzRGlyczogXCIuL3NyYy9sYXlvdXRzL1wiLFxuICAgIH0pLFxuXG4gICAgLy8gRG9jczogaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzI3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBkaXJzOiBbXCJzcmMvQGNvcmUvY29tcG9uZW50c1wiLCBcInNyYy92aWV3cy9kZW1vc1wiLCBcInNyYy9jb21wb25lbnRzXCJdLFxuICAgICAgZHRzOiB0cnVlLFxuICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgIChjb21wb25lbnROYW1lKSA9PiB7XG4gICAgICAgICAgLy8gQXV0byBpbXBvcnQgYFZ1ZUFwZXhDaGFydHNgXG4gICAgICAgICAgaWYgKGNvbXBvbmVudE5hbWUgPT09IFwiVnVlQXBleENoYXJ0c1wiKVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJkZWZhdWx0XCIsXG4gICAgICAgICAgICAgIGZyb206IFwidnVlMy1hcGV4Y2hhcnRzXCIsXG4gICAgICAgICAgICAgIGFzOiBcIlZ1ZUFwZXhDaGFydHNcIixcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pLFxuXG4gICAgLy8gRG9jczogaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLWF1dG8taW1wb3J0I3VucGx1Z2luLWF1dG8taW1wb3J0XG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICBpbXBvcnRzOiBbXG4gICAgICAgIFwidnVlXCIsXG4gICAgICAgIFZ1ZVJvdXRlckF1dG9JbXBvcnRzLFxuICAgICAgICBcIkB2dWV1c2UvY29yZVwiLFxuICAgICAgICBcIkB2dWV1c2UvbWF0aFwiLFxuICAgICAgICBcInZ1ZS1pMThuXCIsXG4gICAgICAgIFwicGluaWFcIixcbiAgICAgIF0sXG4gICAgICBkaXJzOiBbXG4gICAgICAgIFwiLi9zcmMvQGNvcmUvdXRpbHNcIixcbiAgICAgICAgXCIuL3NyYy9AY29yZS9jb21wb3NhYmxlL1wiLFxuICAgICAgICBcIi4vc3JjL2NvbXBvc2FibGVzL1wiLFxuICAgICAgICBcIi4vc3JjL3V0aWxzL1wiLFxuICAgICAgICBcIi4vc3JjL3BsdWdpbnMvKi9jb21wb3NhYmxlcy8qXCIsXG4gICAgICBdLFxuICAgICAgdnVlVGVtcGxhdGU6IHRydWUsXG5cbiAgICAgIC8vIFx1MjEzOVx1RkUwRiBEaXNhYmxlZCB0byBhdm9pZCBjb25mdXNpb24gJiBhY2NpZGVudGFsIHVzYWdlXG4gICAgICBpZ25vcmU6IFtcInVzZUNvb2tpZXNcIiwgXCJ1c2VTdG9yYWdlXCJdLFxuICAgICAgZXNsaW50cmM6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgZmlsZXBhdGg6IFwiLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvblwiLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBzdmdMb2FkZXIoKSxcbiAgXSxcbiAgZGVmaW5lOiB7IFwicHJvY2Vzcy5lbnZcIjoge30gfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLi9zcmNcIiwgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICBcIkB0aGVtZUNvbmZpZ1wiOiBmaWxlVVJMVG9QYXRoKFxuICAgICAgICBuZXcgVVJMKFwiLi90aGVtZUNvbmZpZy5qc1wiLCBpbXBvcnQubWV0YS51cmwpXG4gICAgICApLFxuICAgICAgXCJAY29yZVwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyYy9AY29yZVwiLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgIFwiQGxheW91dHNcIjogZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLi9zcmMvQGxheW91dHNcIiwgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICBcIkBpbWFnZXNcIjogZmlsZVVSTFRvUGF0aChcbiAgICAgICAgbmV3IFVSTChcIi4vc3JjL2Fzc2V0cy9pbWFnZXMvXCIsIGltcG9ydC5tZXRhLnVybClcbiAgICAgICksXG4gICAgICBcIkBzdHlsZXNcIjogZmlsZVVSTFRvUGF0aChcbiAgICAgICAgbmV3IFVSTChcIi4vc3JjL2Fzc2V0cy9zdHlsZXMvXCIsIGltcG9ydC5tZXRhLnVybClcbiAgICAgICksXG4gICAgICBcIkBjb25maWd1cmVkLXZhcmlhYmxlc1wiOiBmaWxlVVJMVG9QYXRoKFxuICAgICAgICBuZXcgVVJMKFwiLi9zcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMvX3RlbXBsYXRlLnNjc3NcIiwgaW1wb3J0Lm1ldGEudXJsKVxuICAgICAgKSxcbiAgICAgIFwiQGRiXCI6IGZpbGVVUkxUb1BhdGgoXG4gICAgICAgIG5ldyBVUkwoXCIuL3NyYy9wbHVnaW5zL2Zha2UtYXBpL2hhbmRsZXJzL1wiLCBpbXBvcnQubWV0YS51cmwpXG4gICAgICApLFxuICAgICAgXCJAYXBpLXV0aWxzXCI6IGZpbGVVUkxUb1BhdGgoXG4gICAgICAgIG5ldyBVUkwoXCIuL3NyYy9wbHVnaW5zL2Zha2UtYXBpL3V0aWxzL1wiLCBpbXBvcnQubWV0YS51cmwpXG4gICAgICApLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA1MDAwLFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbXCJ2dWV0aWZ5XCJdLFxuICAgIGVudHJpZXM6IFtcIi4vc3JjLyoqLyoudnVlXCJdLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1SLE9BQU8sU0FBUztBQUNuUyxPQUFPLFlBQVk7QUFDbkIs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
