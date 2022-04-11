module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "vue-jest"
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!primevue/.*)"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,vue}",
    "!src/main.js" // No need to cover bootstrap file
  ],
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"]
};
