import Icon from '@/directives/icon';
import { createApp } from 'vue';
import './assets/tailwind.css';
import './assets/main.css';
import ProgressBar from '@/includes/progress-bar';
import { auth } from './includes/firebase.config';
import App from './App.vue';
import i18n from './includes/i18n';
import './registerServiceWorker';
import VeeValidatePlugin from './includes/validation';
import store from './store';
import router from './router';

let app;
ProgressBar(router);

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App).use(i18n);
    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.directive('icon', Icon);
    app.mount('#app');
  }
});
