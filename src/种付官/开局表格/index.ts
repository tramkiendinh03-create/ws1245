import { createPinia } from 'pinia';
import { createApp } from 'vue';
import '../index.css';
import App from './App.vue';

$(() => {
  const app = createApp(App).use(createPinia());
  app.mount('#app');
  $(window).on('pagehide', () => app.unmount());
});
