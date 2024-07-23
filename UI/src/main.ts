import '@/assets/main.scss';
import { createApp } from 'vue';
 
import vuetify from '@/plugins/vuetify';
import App from './App.vue';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';; 

const toastOptions = {
  // Your toast options here
  position: "top-right",
  timeout: 5000,
};


createApp(App)
  .use(vuetify)
  .use(Toast, toastOptions)
  .mount('#app');
