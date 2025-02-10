import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Ensure your app runs before tests
    setupNodeEvents(on, config) {
      // Add event listeners here if needed
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite', // Change to 'webpack' if you're not using Vite
    },
  },
});