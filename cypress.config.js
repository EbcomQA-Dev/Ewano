const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth : 1080,
  viewportHeight :1920,
  e2e: {
     baseUrl : 'https://sandbox-ebcom.mci.ir/ecm/ewano/pwa2',
     excludeSpecPattern : ['**/1-getting-started , **/2-advanced-examples'],
     specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: 'cypress/support/e2e.js',
  },
});
