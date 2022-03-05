import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
const path = require("path");

export default defineConfig({
  plugins: [
    vue()
    // esbuildCommonjs(['path','meilisearch', 'uuid'])
  ],
  resolve: {
    dedupe: ["vue"],
    alias: { "./runtimeConfig": "./runtimeConfig.browser", "@": path.resolve(__dirname, "./src") }
  },
  server: {
    port: 8082
  },
  test: {
    globals: true,
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost"
      }
    }
  },
  
  // optimizeDeps: {
  //   exclude: ['/query/']
  // },
  // build: {
  //   commonjsOptions: {
  //     include: [/node_modules/],
  //     exclude: [/query/]
  //   }
  // }
});
