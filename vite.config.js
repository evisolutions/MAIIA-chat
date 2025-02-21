import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/@core'),
      '@layouts': path.resolve(__dirname, './src/@layouts'),
      '@themeConfig': path.resolve(__dirname, './themeConfig.js'),
      '@images': path.resolve(__dirname, './src/assets/images/'),
      '@styles': path.resolve(__dirname, './src/assets/styles/'),
      '@configured-variables': path.resolve(
        __dirname,
        './src/assets/styles/variables/_template.scss',
      ),
      '@db': path.resolve(__dirname, './src/plugins/fake-api/handlers/'),
      '@api-utils': path.resolve(__dirname, './src/plugins/fake-api/utils/'),
    },
  },
  build: {
    lib: {
      entry: 'src/widget.js',
      name: 'MaiiaWidget',
      formats: ['umd'],
      fileName: format => `maiia-widget.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'vuetify', 'pinia', 'vue-demi'],
      output: {
        globals: {
          vue: 'Vue',
          vuetify: 'Vuetify',
          pinia: 'Pinia',
          'vue-demi': 'VueDemi',
        },
      },
    },
  },
})
