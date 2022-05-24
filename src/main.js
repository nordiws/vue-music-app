import Icon from '@/directives/icon';
import { createApp } from 'vue';
import router from './router';
import store from './store';
import './assets/tailwind.css';
import './assets/main.css';
import VeeValidatePlugin from './includes/validation';
import { auth } from './includes/firebase.config';
import App from './App.vue';
import i18n from './includes/i18n';

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App).use(i18n).use(i18n);
    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.directive('icon', Icon);
    app.mount('#app');
  }
});
